// process.env.NODE_ENV = "production";
const inicioDebug = require("debug")("app:inicio");
const express = require("express");
const config = require("config");
const morgan = require("morgan");
const logger = require("./logger");
const Joi = require("joi");
const schema = Joi.object({
  nombre: Joi.string().alphanum().min(3).max(30).required(),
});
const app = express();
const usuarios = [
  { id: 1, nombre: "Leandro" },
  { id: 2, nombre: "Javier" },
  { id: 3, nombre: "Marcelo" },
];

//Funciones middelware, siempre se ejecuta en orden
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(logger);
app.use(function (req, res, next) {
  console.log(`ya casi esta listo...`);
  next();
});
//Configuracin de entornos
console.log(`Aplicacion: ${config.get("nombre")}`);
console.log(`BD: ${config.get("configDB.host")}`);
console.log(config.has());
//Middleware de terceros
if (app.get("env") === "development") {
  app.use(morgan("tiny")); //LOGS DE LAS PETICIONES HTTP
  inicioDebug("Morgan esta habilitado");
}

app.get("/", async (req, res) => {
  await res.send("Hola mundo desde express");
});
app.get("/api/usuarios", async (req, res) => {
  await res.send(usuarios);
});
app.get("/api/usuarios/:id", async (req, res) => {
  let id = req.params.id;
  let usuario = existeUsuario(id);
  if (!usuario) {
    res.status(404).send("El usuario no existe");
  } else {
    res.send(usuario);
  }
});
app.get("/api/objeto/:year/:mes", async (req, res) => {
  res.send(req.params);
}); //peticion
app.get("/api/parametro/", async (req, res) => {
  res.send(req.query);
}); //peticion

app.post("/api/usuarios", (req, res) => {
  const { error, value } = schema.validate({ nombre: req.body.nombre });
  console.log(error);
  console.log(value);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  const usuario = {
    id: usuarios.length + 1,
    nombre: value.nombre,
  };
  usuarios.push(usuario);
  res.send(usuarios);
});

app.put("/api/usuarios/:id", (req, res) => {
  let id = req.params.id;
  let usuario = existeUsuario(id);
  if (!usuario) {
    res.status(404).send("El usuario no existe");
    return;
  }
  const { error, value } = schema.validate({ nombre: req.body.nombre });
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  usuario.nombre = value.nombre;
  res.send(usuario);
});

app.delete("/api/usuarios/:id", (req, res) => {
  let id = req.params.id;
  let usuario = existeUsuario(id);
  if (!usuario) {
    res.status(404).send("El usuario no existe");
    return;
  }
  const indice = usuarios.indexOf(usuario);
  usuarios.splice(indice, 1);
  res.send(usuarios);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Escuchando en el puerto ${port}...`);
});

const existeUsuario = (id) => {
  return usuarios.find((usu) => usu.id === parseInt(id));
};
