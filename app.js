// process.env.NODE_ENV = "production";
const port = process.env.PORT || 3000;
const inicioDebug = require("debug")("app:inicio");
const express = require("express");
const usuarios = require('./routes/usuarios')
const config = require("config");
const morgan = require("morgan");
const logger = require("./logger");
const app = express();
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
app.use('/api/usuarios',usuarios)
app.listen(port, () => {
  console.log(`Escuchando en el puerto ${port}...`);
});


