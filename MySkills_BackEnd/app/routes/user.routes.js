const express = require("express");
const router = express.Router();

// Import the Controller
const {
    searchUsers,
    updateSomeUserAttributes,
    addSkillToUser,
    removeSkillFromUser,
    modifySkillForUser,
} = require("../controllers/user.controller")

const { verifyToken } = require("../middleware");

router.all('*', verifyToken);

router.put('/search', searchUsers); // Route to search users
router.patch('/:userId', updateSomeUserAttributes); // Route to update user attributes

router.post('/:userId/skills', addSkillToUser); // Route to add a skill to a user
router.delete('/:userId/skills/:skillId', removeSkillFromUser);// Route to remove a skill from a user
router.put('/:userId/skills/:skillId', modifySkillForUser);// Route to modify a skill for a user

module.exports = router;