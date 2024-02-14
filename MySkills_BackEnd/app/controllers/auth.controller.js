var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

const { security } = require("../config/");
const { user: User, role: Role } = require("../models");
const { userRegistrationSuccess, userNotFound, invalidPassword, signoutSuccess } = require("../messages/auth.messages");

// Registo de utilizador
exports.signup = async (req, res) => {
  try {
    // Os utilizadores são do tipo utilizador, portanto é necessário encontrar a role 'user'
    const role = await Role.findOne({ name: "user" }).exec();
    if (!role) {
      return res.status(500).send({ message: "Role not found" });
    }

    // Cria um novo utilizador apenas com as informações básicas fornecidas
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      roles: [role._id]
    });

    // Actualiza o utilizador
    await user.save();
    res.status(200).send(userRegistrationSuccess);
  } catch (err) {
    res.status(500).send({ message: err });
  }
};

// Início de sessão
exports.signin = async (req, res) => {
  try {
    // Encontra o utilizador com o username fornecido e popula as entidades associadas
    const user = await User.findOne({ username: req.body.username }).populate("roles", "-__v").populate("skills.skill", "-__v").exec();
    if (!user) {
      return res.status(404).send(userNotFound);
    }

    // Verifica se a senha do utilizador está correcta
    if (!bcrypt.compareSync(req.body.password, user.password)) {
      return res.status(401).send(invalidPassword);
    }

    // Obtém as roles do utilizador e gera um token JWT com essa informação
    const authorities = user.roles.map(role => "ROLE_" + role.name.toUpperCase());
    const token = jwt.sign({ id: user.id, authorities }, security.secret, security.options);
    const { password, roles, ...userWithoutSensitiveInfo } = user._doc;

    // Retorna os atributos atualizados do utilizador, sem informação sensivel, bem como o token JWT no cabeçalho: X-Access-Token
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

// Terminar sessão
exports.signout = async (req, res) => {
  try {
    // Termina a sessão do utilizador removendo o token do cabeçalho
    return res.status(200).set('x-access-token', null).send(signoutSuccess);
  } catch (err) {
    this.next(err);
  }
};

// Alterar senha
exports.changePassword = async (req, res) => {
  try {
    // Obtém o ID do utilizador a partir do pedido e pesquisa pelo utilizador
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send(userNotFound);
    }

    // Verifica se a senha antiga do utilizador corresponde à indicada no pedido
    if (!bcrypt.compareSync(req.body.old_password, user.password)) {
      return res.status(401).send(invalidPassword);
    }
    // Atualiza o utilizador com a nova senha 
    await User.findByIdAndUpdate(userId, { password: bcrypt.hashSync(req.body.new_password, 8) }, { new: true });

    // Retorna uma mensagem de sucesso
    res.status(200)
      .send({message: "Password Changed"});
  } catch (err) {
    this.next(err);
  }
};
