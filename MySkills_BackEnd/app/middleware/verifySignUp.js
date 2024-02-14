const { roles, user: User } = require("../models");

//Verificar se o nome de utilizador ou o email já estão em uso
checkDuplicateUsernameOrEmail = async (req, res, next) => {
  try {
    // Verifica se o nome de utilizador já está em uso
    let user = await User.findOne({ username: req.body.username }).exec();
    if (user) {
      return res.status(400).send({ message: "Failed! Username is already in use!" });
    }

    // Verifica se o email já está em uso
    user = await User.findOne({ email: req.body.email }).exec();
    if (user) {
      return res.status(400).send({ message: "Failed! Email is already in use!" });
    }

    next();
  } catch (err) {
    res.status(500).send({ message: err }); 
  }
};

//Verificar se as roles especificadas existem no utilizador
checkRolesExisted = (req, res, next) => {
  if (req.body.roles && !req.body.roles.every(role => roles.includes(role))) {
    res.status(400).send({ message: 'Failed! One or more roles do not exist!' }); 
  } else {
    next();
  }
};

module.exports  = {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted
};
