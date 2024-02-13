import SkillService from '../services/skill.service';

const user = JSON.parse(localStorage.getItem('user'));
const isManager = user && user.roles && user.roles.includes('ROLE_MANAGER');

let lastFetchTime = 0;
const BOUNCE = 60000; // 5 minutes in milliseconds

export const skills = {
    namespaced: true,
    state: {
        skills: [],
        canModify: isManager
    },
    actions: {
        async fetchSkills({ commit }) {
            try {
                if (Date.now() - lastFetchTime < BOUNCE) {
                    return this.state.skills;
                } else {
                    lastFetchTime = Date.now();
                }
                const response = await SkillService.fetchSkills();
                commit('fetchSkillsSuccess', response);
                return response;
            } catch (error) {
                commit('fetchSkillsFailure');
                return Promise.reject(error);
            }
        },
        async addSkill({ commit }, skill) {
            try {
                const response = await SkillService.addSkill(skill);
                commit('addSkillSuccess', response);
                return response;
            } catch (error) {
                commit('addSkillFailure');
                return Promise.reject(error);
            }
        },
        async modifySkill({ commit }, skill) {
            try {
                const response = await SkillService.modifySkill(skill._id, skill);
                commit('modifySkillSuccess', skill);
                return response;
            } catch (error) {
                commit('modifySkillFailure');
                return Promise.reject(error);
            }
        },
        async deleteSkill({ commit }, skillId) {
            try {
                const response = await SkillService.deleteSkill(skillId);
                commit('deleteSkillSuccess', skillId);
                return response;
            } catch (error) {
                commit('deleteSkillFailure');
                return Promise.reject(error);
            }
        }
    },
    mutations: {
        fetchSkillsSuccess(state, skills) {
            state.skills = skills;
        },
        fetchSkillsFailure(state) {
            state.skills = [];
        },
        addSkillSuccess(state, skill) {
            state.skills.push(skill);
        },
        modifySkillSuccess(state, skill) {
            const idx = state.skills.findIndex(i => i._id == skill._id);
            if (idx !== -1) {
                state.skills.splice(idx, 1, skill);
            } else {
                throw Error("modifySkillFailure",state);
            }       
        },
        deleteSkillSuccess(state, skillId) {
            state.skills = state.skills.filter(skill => skill._id !== skillId);
        },
        addSkillFailure(state) {
            throw Error("addSkillFailure",state);
        },
        modifySkillFailure(state) {
            throw Error("modifySkillFailure",state);
        },
        deleteSkillFailure(state) {
            throw Error("deleteSkillFailure",state);
        }
    }
};