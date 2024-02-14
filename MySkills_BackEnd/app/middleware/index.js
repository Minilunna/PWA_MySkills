// Módulo que agrega todas as funções de middleware de dos modulos especificados em baixo
module.exports = {
  ...require("./auth.jwt"),
  ...require("./verifySignUp")
};
