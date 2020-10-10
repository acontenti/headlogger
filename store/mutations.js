import initialState from "./state";

export default {
	RESET_STORE: (state) => {
		Object.assign(state, initialState());
	},

	SET_AUTH_USER: (state, {authUser}) => {
		const {uid, email} = authUser;
		state.user = {uid, email};
	}
};
