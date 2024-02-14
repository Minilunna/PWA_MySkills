const { skills: Skill, user: User } = require("../models");
const {
    skillCreationSuccess,
    skillNotFound,
    skillUpdateSuccess,
    skillDeleteSuccess,
    serverError
} = require("../messages/skills.messages");

// Criar uma nova competência
exports.createSkill = async (req, res) => {
    try {
        // Cria uma nova instância de Skill com os dados fornecidos
        const skill = new Skill({
            id: req.body.id,
            name: req.body.name,
            description: req.body.description,
            icon: req.body.icon
        });

        // Guarda a nova competência na base de dados
        await skill.save();
        res.status(201).send(skillCreationSuccess);
    } catch (err) {
        res.status(500).send(serverError(err));
    }
};

// Obter todas as competências
exports.getSkills = async (req, res) => {
    try {
        // Obtém todas as competências da base de dados
        const skills = await Skill.find();
        res.status(200).send(skills);
    } catch (err) {
        res.status(500).send(serverError(err));
    }
};

// Obter competência por ID
exports.getSkillById = async (req, res) => {
    try {
        // Procura uma competência pelo ID fornecido no pedido
        const skill = await Skill.findById(req.params.skillId);
        if (!skill) {
            return res.status(404).send(skillNotFound);
        }
        res.status(200).send(skill);
    } catch (err) {
        res.status(500).send(serverError(err));
    }
};

// Atualizar uma competência
exports.updateSkill = async (req, res) => {
    try {
        // Procura e atualiza uma competência pelo ID fornecido devolvendo a skill actualizada
        const skill = await Skill.findByIdAndUpdate(req.params.skillId, req.body, { new: true });
        if (!skill) {
            return res.status(404).send(skillNotFound);
        }
        res.status(200).send(skillUpdateSuccess);
    } catch (err) {
        res.status(500).send(serverError(err));
    }
};

// Eliminar uma competência
exports.deleteSkill = async (req, res) => {
    try {
        // Procura e elimina uma competência pelo ID fornecido
        const skill = await Skill.findByIdAndRemove(req.params.skillId);
        if (!skill) {
            return res.status(404).send(skillNotFound);
        }
        // Atualiza os utilizadores que tinham essa competência removendo-a
        await User.updateMany({ 'skills.skill': req.params.skillId }, { $pull: { skills: { skill: req.params.skillId } } });
        res.status(200).send(skillDeleteSuccess);
    } catch (err) {
        res.status(500).send(serverError(err));
    }
};
