import { put, post, patch, remove } from "@/services/network.service";

class UserService {
  async updateSomeUserAttributes(userId, updatedAttributes) {
    try {
      return await patch(`users/${userId}`, updatedAttributes);
    } catch (error) {
      throw new Error("Failed to update user attributes");
    }
  }

  async addSkillToUser(userId, skill) {
    try {
      return await post(`users/${userId}/skills/`, skill );
    } catch (error) {
      throw new Error("Failed to add skill to user");
    }
  }

  async removeSkillFromUser(userId, skillId) {
    try {
      return await remove(`users/${userId}/skills/${skillId}`);
    } catch (error) {
      throw new Error("Failed to remove skill from user");
    }
  }

  async modifySkillForUser(userId, skill) {
    try {
      return await put(`users/${userId}/skills/${skill.id}`, skill);
    } catch (error) {
      throw new Error("Failed to modify user skill");
    }
  }

  async getUsersBySkills(skills){
    try {
      return await put(`users/search`, {skills});
    } catch (error) {
      throw new Error("Failed to search users");
    }
  }

}

export default new UserService();