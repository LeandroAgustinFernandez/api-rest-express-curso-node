function log(req, res, next){
  console.log(`iniciando...`);
  next();
};
module.exports = log;