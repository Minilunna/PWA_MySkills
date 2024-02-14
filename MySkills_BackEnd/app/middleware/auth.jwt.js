const jwt = require("jsonwebtoken");
const { security } = require("../config");
const { user: User, role: Role } = require("../models");
const { noTokenProvided, unauthorized, roleRequired } = require("../messages/auth.messages");

// Função para verificar se o token JWT está presente e é válido
verifyToken = async (req, res, next) => {
  // Obtém o token do cabeçalho da requisição
  let token = req.headers["x-access-token"];

  // Verifica se o token JWT existe
  if (!token) {
    return res.status(403).send(noTokenProvided);
  }

  try {
    // Verifica se o token JWT é válido e descodifica o seu conteúdo
    const decoded = await jwt.verify(token, security.secret);
    // Adiciona o ID do utilizador e as autoridades decodificadas ao pedido (req)
    req.userId = decoded.id;
    req.userAuthorities = decoded.authorities;
    next();
  } catch (err) {
    return res.status(401).send(unauthorized); // Retorna erro de não autorizado se o token for inválido
  }
};

// Função para verificar se o utilizador tem um determinado role
requireRole = async (role, req, res, next) => {
  try {
    // Procura o utilizador na base de dados pelo ID
    const user = await User.findById(req.userId).exec();
    // Procura as roles do utilizador
    const roles = await Role.find({ _id: { $in: user.roles } }).exec();
    // Verifica se o utilizador tem a role requerida
    if (roles.some(r => r.name === role)) {
      next(); // Caso tenha, avança para a próxima função de middleware
    } else {
      res.status(403).send(roleRequired(role)); // Retorna erro de acesso proibido se o utilizador não tiver a role necessária
    }
  } catch (err) {
    res.status(500).send({ message: err });
  }
};

module.exports = {
  verifyToken,
  requireRole,
  isAdmin: (req, res, next) => requireRole("admin", req, res, next),
  isManager: (req, res, next) => requireRole("manager", req, res, next),
};
