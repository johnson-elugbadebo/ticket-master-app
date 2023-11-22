import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './apiSlice';
import { setupListeners } from '@reduxjs/toolkit/query';
import authReducer from '../features/auth/authSlice.jsx';

const store = configureStore({
	reducer: {
		[apiSlice.reducerPath]: apiSlice.reducer,
		auth: authReducer,
	},

	middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
	devTools: false,
});

// To refresh the data, so you don't have stale data
setupListeners(store.dispatch);

export { store };
