import { get, put, post, remove } from "@/services/network.service";

class SkillService {
  fetchSkills() {
    return get('skills');
  }

  addSkill(skill) {
    return post('skills', skill);
  }

  modifySkill(skillId, skill) {
    return put(`skills/${skillId}`, skill);
  }

  deleteSkill(skillId) {
    return remove(`skills/${skillId}`);
  }
}

export default new SkillService();