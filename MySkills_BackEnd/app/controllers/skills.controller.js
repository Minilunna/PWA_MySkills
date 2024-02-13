const { skills: Skill, user:User } = require("../models");
const {
    skillCreationSuccess,
    skillNotFound,
    skillUpdateSuccess,
    skillDeleteSuccess,
    serverError
} = require("../messages/skills.messages");

exports.createSkill = async (req, res) => {
    try {
        const skill = new Skill({
            id: req.body.id,
            name: req.body.name,
            description: req.body.description,
            icon: req.body.icon
        });

        await skill.save();
        res.status(201).send(skillCreationSuccess);
    } catch (err) {
        res.status(500).send(serverError(err));
    }
};


exports.getSkills = async (req, res) => {
    try {
        const skills = await Skill.find();
        res.status(200).send(skills);
    } catch (err) {
        res.status(500).send(serverError(err));
    }
};

exports.getSkillById = async (req, res) => {
    try {
        const skill = await Skill.findById(req.params.skillId);
        if (!skill) {
            return res.status(404).send(skillNotFound);
        }
        res.status(200).send(skill);
    } catch (err) {
        res.status(500).send(serverError(err));
    }
};

exports.updateSkill = async (req, res) => {
    try {
        const skill = await Skill.findByIdAndUpdate(req.params.skillId, req.body, { new: true });
        if (!skill) {
            return res.status(404).send(skillNotFound);
        }
        res.status(200).send(skillUpdateSuccess);
    } catch (err) {
        res.status(500).send(serverError(err));
    }
};

exports.deleteSkill = async (req, res) => {
    try {
        const skill = await Skill.findByIdAndRemove(req.params.skillId);
        if (!skill) {
            return res.status(404).send(skillNotFound);
        }
        // Update users
        await User.updateMany({ 'skills.skill': req.params.skillId }, { $pull: { skills: { skill: req.params.skillId } } });
        res.status(200).send(skillDeleteSuccess);
    } catch (err) {
        res.status(500).send(serverError(err));
    }
};
