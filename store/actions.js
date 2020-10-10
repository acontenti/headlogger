export default {
	async nuxtServerInit({ dispatch, commit }, { res }) {
		if (res && res.locals && res.locals.user) {
			const {allClaims: claims, ...authUser} = res.locals.user
			await dispatch("onAuthStateChanged", {
				authUser,
				claims
			});
		}
	},

	onAuthStateChanged({commit}, {authUser}) {
		if (!authUser) {
			commit("RESET_STORE");
			return;
		}
		commit("SET_AUTH_USER", {authUser});
	}
};
