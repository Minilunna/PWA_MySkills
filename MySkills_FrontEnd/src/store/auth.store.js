import AuthService from '@/services/auth.service';

const token = JSON.parse(localStorage.getItem('token'));
export const auth = {
  namespaced: true,
  state: {
    status: { loggedIn: !!token },
    token: token,
  },
  actions: {
    async login({ commit, dispatch }, user) {
      try {
        const response = await AuthService.login(user);
        localStorage.setItem('token', JSON.stringify(response.token));
        dispatch('users/changeUser', response.body, { root: true }); // Call the changeUser action from the user store
        commit('loginSuccess', token);
        return response.body;
      } catch (error) {
        commit('loginFailure');
        return Promise.reject(error);
      }
    },
    logout({ commit, dispatch }) {
      AuthService.logout();
      localStorage.removeItem('token');
      dispatch('users/changeUser', null, { root: true });
      commit('logout');
    },
    async register({ commit }, user) {
      try {
        const response = await AuthService.register(user);
        commit('registerSuccess');
        return response.data;
      } catch (error) {
        commit('registerFailure');
        return Promise.reject(error);
      }
    }
  },
  mutations: {
    loginSuccess(state, token) {
      state.status.loggedIn = true;
      state.token = token;
    },
    loginFailure(state) {
      state.status.loggedIn = false;
      state.token = null;
    },
    logout(state) {
      state.status.loggedIn = false;
      state.token = null;
    },
    registerSuccess(state) {
      state.status.loggedIn = false;
      state.token = null;
    },
    registerFailure(state) {
      state.status.loggedIn = false;
      state.token = null;
    },
  }
};