const jwt = require("jsonwebtoken");
const { security } = require("../config");
const { user: User, role: Role } = require("../models");
const { noTokenProvided, unauthorized, roleRequired } = require("../messages/auth.messages");

verifyToken = async (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send(noTokenProvided);
  }

  try {
    const decoded = await jwt.verify(token, security.secret);
    req.userId = decoded.id;
    req.userAuthorities = decoded.authorities;
    next();
  } catch (err) {
    return res.status(401).send(unauthorized);
  }
};

requireRole = async (role, req, res, next) => {
  try {
    const user = await User.findById(req.userId).exec();
    const roles = await Role.find({ _id: { $in: user.roles } }).exec();
    if (roles.some(r => r.name === role)) {
      next();
    } else {
      res.status(403).send(roleRequired(role));
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