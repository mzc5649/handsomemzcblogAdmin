const state = {
  edit: {
    oldCoverUrl: ''
  }
}
const mutations = {
  SAVE_EDIT_OLD_COVER_URL(state, data) {
    state.edit.oldCoverUrl = data
  }
}
const actions = {
  saveEditOldCoverUrl({ commit }, data) {
    commit('SAVE_EDIT_OLD_COVER_URL', data)
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
