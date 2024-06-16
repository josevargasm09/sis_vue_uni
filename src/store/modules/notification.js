const state = {
    snackbar: {
      visible: false,
      message: '',
      color: ''
    }
  };
  
  const mutations = {
    SHOW_SNACKBAR(state, { message, color }) {
      state.snackbar.visible = true;
      state.snackbar.message = message;
      state.snackbar.color = color;
    },
    HIDE_SNACKBAR(state) {
      state.snackbar.visible = false;
      state.snackbar.message = '';
      state.snackbar.color = '';
    }
  };
  
  const actions = {
    showSnackbar({ commit }, { message, color }) {
      commit('SHOW_SNACKBAR', { message, color });
    },
    hideSnackbar({ commit }) {
      commit('HIDE_SNACKBAR');
    }
  };
  
  const getters = {
    snackbar: state => state.snackbar
  };
  
  export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
  };