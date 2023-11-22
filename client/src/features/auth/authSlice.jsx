import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	// isLoading: false,
	// isSidebarOpen: false,
	// user: null,
	token: null,
	// showAlert: false,
	// alertText: '',
	// alertType: '',
};

const authSlice = createSlice({
	name: 'auth',
	initialState: initialState,
	reducers: {
		setCredentials: (state, action) => {
			const { accessToken } = action.payload;
			// state.user = user;
			state.token = accessToken;
		},
		logOut: (state, action) => {
			// state.user = null;
			state.token = null;
		},
	},
});

// Export Reducer Actions
export const { setCredentials, logOut } = authSlice.actions;
// Export Reducer
export default authSlice.reducer;
// Export Selectors
// export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;
