// get：this.$store.state.common.test
// set：this.$store.commit('common/setTest', value)

const state = {
    test: ''
}
const mutations = {
    setTest(state, data) {
        state.test = data
    }
}
const getters = {
    getTest(state) {
        return state.test
    }
}
const actions = {
    getTest({
        commit
    }, params) {
        commit(setTest, params)
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}