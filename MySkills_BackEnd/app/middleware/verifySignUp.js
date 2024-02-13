const { roles, user: User } = require("../models");

checkDuplicateUsernameOrEmail = async (req, res, next) => {
  try {
    let user = await User.findOne({ username: req.body.username }).exec();
    if (user) {
      return res.status(400).send({ message: "Failed! Username is already in use!" });
    }

    user = await User.findOne({ email: req.body.email }).exec();
    if (user) {
      return res.status(400).send({ message: "Failed! Email is already in use!" });
    }

    next();
  } catch (err) {
    res.status(500).send({ message: err });
  }
};

checkRolesExisted = (req, res, next) => {
  if (req.body.roles && !req.body.roles.every(role => roles.includes(role))) {
    res.status(400).send({ message: `Failed! One or more roles do not exist!` });
  } else {
    next();
  }
};

module.exports  = {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted
};
