import UserService from '@/services/user.service';

const user = JSON.parse(localStorage.getItem('user'));
export const users = {
  namespaced: true,
  state: {
    users: [], // Initial list of users
    user: user,
  },
  actions: {
    changeUser({ commit }, user) {
      if (user == null) {
        localStorage.removeItem('user');
      } else {
        localStorage.setItem('user', JSON.stringify(user));
      }
      commit('setCurrentUserSuccess', user);
    },
    async pictureUpdated({ commit, state }, picture) {
      try {
        const user = await UserService.updateSomeUserAttributes(state.user._id, picture);
        commit('setCurrentUserSuccess', user);
        return user;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    
    async profileUpdated({ commit, state }, profile) {
      try {
        const user = await UserService.updateSomeUserAttributes(state.user._id, profile);
        commit('setCurrentUserSuccess', user);
        return user;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    async fetchUsersBySkills({ commit }, skills) {
      try {
        const skillsId = skills.map(skill => skill._id);
        const users = await UserService.getUsersBySkills(skillsId);
        commit('fetchUsersBySkillsSuccess', users);
        return users;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    async addSkillToUser({ commit, state }, skill) {
      try {
        const res = await UserService.addSkillToUser(state.user._id, skill);
        commit('addSkillToUserSuccess', res);
        return state.user;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    async removeSkillFromUser({ commit, state }, id) {
      try {
        await UserService.removeSkillFromUser(state.user._id, id);
        commit('removeSkillFromUserSuccess', id);
        return state.user;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    async modifySkillForUser({ commit, state }, skill) {
      try {
        await UserService.modifySkillForUser(state.user._id, skill);
        commit('modifySkillForUserSuccess', skill);
        return state.user;
      } catch (error) {
        return Promise.reject(error);
      }
    },
  },
  mutations: {
    setCurrentUserSuccess(state, newUser) {
      state.user = newUser;
      localStorage.setItem('user', JSON.stringify(state.user));
    },
    fetchUsersBySkillsSuccess(state, users) {
      state.users = users;
    },
    addSkillToUserSuccess(state, skill) {
      state.user.skills.push(skill);
      localStorage.setItem('user', JSON.stringify(state.user));
    },
    removeSkillFromUserSuccess(state, id) {
      state.user.skills = state.user.skills.filter(skill => skill.skill._id != id);
      localStorage.setItem('user', JSON.stringify(state.user));
    },
    modifySkillForUserSuccess(state, skill) {
      const skillIndex = state.user.skills.findIndex(seek => seek.skill == skill.id);
      if (skillIndex !== -1) {
        state.user.skills[skillIndex].proficiency = skill.proficiency;
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    }
  },
  getters: {
    getUsers: (state) => state.users,
  },
};
