// user.service.js

const { user: User, skills: Skill } = require('../models/');

class UserService {
  static async updateSomeUserAttributes(userId, updatedAttributes) {
    try {
      const user = await User.findByIdAndUpdate(userId, updatedAttributes, { new: true }).populate("roles", "-__v").populate("skills.skill", "-__v").exec();
      const authorities = user.roles.map(role => "ROLE_" + role.name.toUpperCase());
      const { password, roles, ...userWithoutSensitiveInfo } = user._doc;
      return {
        ...userWithoutSensitiveInfo,
        roles: authorities,
      };
    } catch (error) {
      throw new Error("Failed to update user attributes");
    }
  }

  static async addSkillToUser(userId, userSkill) {
    try {
      const user = await User.findById(userId);
      const skill = await Skill.findById(userSkill.id);

      user.skills.push({ skill: userSkill.id, proficiency: userSkill.proficiency });
      const sk = await user.save();
      return {
        _id: sk.skills.slice(-1)[0]._id,
        skill,
        proficiency: userSkill.proficiency
      };
    } catch (error) {
      throw new Error("Failed to add skill to user");
    }
  }

  static async removeSkillFromUser(userId, skillId) {
    try {
      const user = await User.findById(userId);
      user.skills = user.skills.filter(skill => skill != skillId);
      await user.save();
      return { message: "Skill removed from user successfully" };
    } catch (error) {
      throw new Error("Failed to remove skill from user");
    }
  }

  static async modifySkillForUser(userId, skillId, proficiency) {
    try {
      const user = await User.findById(userId);
      const skillIndex = user.skills.findIndex(seek => seek.skill == skillId);
      if (skillIndex !== -1) {
        user.skills[skillIndex].proficiency = proficiency;
        await user.save();
        return { message: "User skill modified successfully" };
      } else {
        throw new Error("Skill not found for the user");
      }
    } catch (error) {
      throw new Error("Failed to modify user skill");
    }
  }
  static async search(criteria) {
    try {
      const users = await User.find({ 'skills.skill': { $in: criteria.skills } }).populate("skills.skill", "-__v").exec();
      return users.map(user => {
        const { password, roles, ...userWithoutSensitiveInfo } = user._doc;
        return userWithoutSensitiveInfo;
      })
    } catch (error) {
      throw new Error('Error finding users:', error);
    }
  }
}

module.exports = UserService;

