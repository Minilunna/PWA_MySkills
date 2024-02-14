const { user: User, skills: Skill } = require('../models/');
const { 
    skillRemoveSuccess, 
    skillModifySuccess,
    skillNotFound,
    userSearchFailed, 
    userUpdateFailed,
    skillAddFailed,
    skillRemoveFailed, 
    skillModifyFailed 
} = require('../messages/user.messages');

// Método para atualizar alguns atributos do utilizador
exports.updateSomeUserAttributes = async (req, res) => {
    const userId = req.params.userId;
    const updatedAttributes = req.body;
    try {
        // Encontra e atualiza o utilizador com os atributos fornecidos, devolvendo o novo estado do utilizador, populando as entidades associadas
        const user = await User.findByIdAndUpdate(userId, updatedAttributes, { new: true }).populate("roles", "-__v").populate("skills.skill", "-__v").exec();
        // Formata as autoridades do utilizador, colocando-as em maiúsculas e prefixadas por ROLE_
        const authorities = user.roles.map(role => "ROLE_" + role.name.toUpperCase());
        // Remove as informações sensíveis do utilizador
        const { password, roles, ...userWithoutSensitiveInfo } = user._doc;
        // Retorna os atributos atualizados do utilizador, sem informação sensível e com o novo formato de roles 
        res.json({
            ...userWithoutSensitiveInfo,
            roles: authorities,
        });
    } catch (error) {
        res.status(500).json(userUpdateFailed);
    }
}

// Método para adicionar uma competência a um utilizador
exports.addSkillToUser = async (req, res) => {
    const userId = req.params.userId;
    const userSkill = req.body;
    try {
        // Encontra o utilizador e a Competência
        const user = await User.findById(userId);
        const skill = await Skill.findById(userSkill.id);

        // Adiciona a competência ao utilizador, definindo a sua proficiência e atualiza o utilizador
        user.skills.push({ skill: userSkill.id, proficiency: userSkill.proficiency });
        const sk = await user.save();

        // Retorna a competência adicionada ao utilizador, que é a última do array
        res.json({
            _id: sk.skills.slice(-1)[0]._id,
            skill,
            proficiency: userSkill.proficiency
        });
    } catch (error) {
        res.status(500).json(skillAddFailed);
    }
}

// Método para remover uma competência de um utilizador
exports.removeSkillFromUser = async (req, res) => {
    const userId = req.params.userId;
    const skillId = req.params.skillId;
    try {
        // Encontra o utilizador
        const user = await User.findById(userId);

        // Remove a competência
        user.skills = user.skills.filter(skill => skill != skillId);
        // Atualiza o utilizador
        await user.save();
        // Retorna uma mensagem de sucesso
        res.json(skillRemoveSuccess);
    } catch (error) {
        res.status(500).json(skillRemoveFailed);
    }
}

// Método para modificar a proficiência de uma competência de um utilizador
exports.modifySkillForUser = async (req, res) => {
    const userId = req.params.userId;
    const skillId = req.params.skillId;
    const proficiency = req.body.proficiency; // Assuming the updated skill data is sent in the request body
    try {
        // Encontra o utilizador, de seguida encontra a competência a modificar
        const user = await User.findById(userId);
        const skillIndex = user.skills.findIndex(seek => seek.skill == skillId);
        if (skillIndex !== -1) {
            // Modifica a proficiência da competência e atualiza o utilizador
            user.skills[skillIndex].proficiency = proficiency;
            await user.save();
            // Retorna uma mensagem de sucesso
            res.json(skillModifySuccess);
        } else {
            res.status(500).json(skillNotFound);
        }
    } catch (error) {
        res.status(500).json(skillModifyFailed);
    }
};

// Método para pesquisar utilizadores com base em critérios de competências
exports.searchUsers = async (req, res) => {
    const criteria = req.body;
    try {
        // Procura utilizadores com as competências especificadas, populando de seguida as mesmas
        const users = await User.find({ 'skills.skill': { $in: criteria.skills } }).populate("skills.skill", "-__v").exec();

        // Retorna os utilizadores encontrados sem informações sensíveis
        const resp = users.map(user => {
            const { password, roles, ...userWithoutSensitiveInfo } = user._doc;
            return userWithoutSensitiveInfo;
        });

        res.json(resp);
    } catch (error) {
        res.status(500).json(userSearchFailed);
    }
};
