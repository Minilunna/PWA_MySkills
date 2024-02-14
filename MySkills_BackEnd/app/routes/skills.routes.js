const express = require("express");
const router = express.Router();
const { verifyToken, isManager } = require("../middleware");

// Controller
const {
    createSkill,
    getSkills,
    getSkillById,
    updateSkill,
    deleteSkill
} = require("../controllers/skills.controller");

// Routes
router.all('*', verifyToken)
router.get("/:skillId", getSkillById); // Retrieve a single skill with id
router.put("/:skillId", [isManager], updateSkill); // Update a skill with id
router.delete("/:skillId", [isManager], deleteSkill); // Delete a skill with id
router.post("/", [isManager], createSkill); // Create a new skill
router.get("/", getSkills); // Retrieve all skills

module.exports = router;