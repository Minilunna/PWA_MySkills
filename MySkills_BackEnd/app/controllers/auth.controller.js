var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

const { security } = require("../config/");
const { user: User, role: Role } = require("../models");
const { userRegistrationSuccess, userNotFound, invalidPassword, signoutSuccess } = require("../messages/auth.messages");

exports.signup = async (req, res) => {
  try {
    const role = await Role.findOne({ name: "user" }).exec();
    if (!role) {
      return res.status(500).send({ message: "Role not found" });
    }

    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      roles: [role._id]
    });

    await user.save();
    res.status(200).send(userRegistrationSuccess);
  } catch (err) {
    res.status(500).send({ message: err });
  }
};

exports.signin = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username }).populate("roles", "-__v").populate("skills.skill", "-__v").exec();
    if (!user) {
      return res.status(404).send(userNotFound);
    }

    if (!bcrypt.compareSync(req.body.password, user.password)) {
      return res.status(401).send(invalidPassword);
    }

    const authorities = user.roles.map(role => "ROLE_" + role.name.toUpperCase());
    const token = jwt.sign({ id: user.id, authorities }, security.secret, security.options);
    const { password, roles, ...userWithoutSensitiveInfo } = user._doc;

    res.status(200)
      .set('x-access-token', token)
      .send({
        ...userWithoutSensitiveInfo,
        roles: authorities,
      });

  } catch (err) {
    res.status(500).send({ message: err });
  }
};

exports.signout = async (req, res) => {
  try {
    return res.status(200).set('x-access-token', null).send(signoutSuccess);
  } catch (err) {
    this.next(err);
  }
};

exports.changePassword = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send(userNotFound);
    }

    if (!bcrypt.compareSync(req.body.old_password, user.password)) {
      return res.status(401).send(invalidPassword);
    }
    await User.findByIdAndUpdate(userId, { password: bcrypt.hashSync(req.body.new_password, 8) }, { new: true });

    res.status(200)
      .send({message: "Password Changed"});
  } catch (err) {
    this.next(err);
  }
};