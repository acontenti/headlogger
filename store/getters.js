export default {
	isLoggedIn: (state) => {
		try {
			return state.user != null && state.user.uid != null;
		} catch {
			return false;
		}
	}
};
