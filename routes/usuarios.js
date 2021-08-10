const express = require("express");
const Joi = require("joi");
const routs = express.Router();
const schema = Joi.object({
  nombre: Joi.string().alphanum().min(3).max(30).required(),
});
const usuarios = [
  { id: 1, nombre: "Leandro" },
  { id: 2, nombre: "Javier" },
  { id: 3, nombre: "Marcelo" },
];
// app.get("/", async (req, res) => {
//   await res.send("Hola mundo desde express");
// });
routs.get("/", async (req, res) => {
  await res.send(usuarios);
});
routs.get("/:id", async (req, res) => {
  let id = req.params.id;
  let usuario = existeUsuario(id);
  if (!usuario) {
    res.status(404).send("El usuario no existe");
  } else {
    res.send(usuario);
  }
});
// routs.get("/api/objeto/:year/:mes", async (req, res) => {
//   res.send(req.params);
// }); //peticion
// routs.get("/api/parametro/", async (req, res) => {
//   res.send(req.query);
// }); //peticion
routs.post("/", (req, res) => {
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

routs.put("/:id", (req, res) => {
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

routs.delete("/:id", (req, res) => {
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

const existeUsuario = (id) => {
  return usuarios.find((usu) => usu.id === parseInt(id));
};

module.exports = routs