const express = require("express");
const router = express.Router();

// Import the UserService
const UserService = require("../controllers/user.controller")

const { verifyToken, isModerator, isAdmin } = require("../middleware");

router.all('*', verifyToken)

// Route to search users
router.put('/search', async (req, res) => {
    try {
        res.json(await UserService.search(req.body));
    } catch (error) {
        res.status(500).json({ error: "Failed to modify user skill" });
    }
});

// Route to update user attributes
router.patch('/:userId', async (req, res) => {
    const userId = req.params.userId;
    const updatedAttributes = req.body;
    try {
        const updatedUser = await UserService.updateSomeUserAttributes(userId, updatedAttributes);
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: "Failed to update user attributes" });
    }
});

// Route to add a skill to a user
router.put('/:userId/skills', async (req, res) => {
    const userId = req.params.userId;
    try {
        const resp = await UserService.addSkillToUser(userId, req.body)
        return res.json(resp);
    } catch (error) {
        res.status(500).json({ error: "Failed to add skill to user" });
    }
});

// Route to remove a skill from a user
router.delete('/:userId/skills/:skillId', async (req, res) => {
    const userId = req.params.userId;
    const skillId = req.params.skillId;
    try {
        res.json(await UserService.removeSkillFromUser(userId, skillId));
    } catch (error) {
        res.status(500).json({ error: "Failed to remove skill from user" });
    }
});

// Route to modify a skill for a user
router.put('/:userId/skills/:skillId', async (req, res) => {
    const userId = req.params.userId;
    const skillId = req.params.skillId;
    const proficiency = req.body.proficiency; // Assuming the updated skill data is sent in the request body
    try {
        res.json(await UserService.modifySkillForUser(userId, skillId, proficiency));
    } catch (error) {
        res.status(500).json({ error: "Failed to modify user skill" });
    }
});

module.exports = router;