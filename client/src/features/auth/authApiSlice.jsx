import { apiSlice } from '../../context/apiSlice';
import { logOut, setCredentials } from './authSlice';

export const authApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		login: builder.mutation({
			query: (credentials) => ({
				url: '/api/v1/auth',
				method: 'POST',
				body: { ...credentials },
			}),
		}),
		sendLogout: builder.mutation({
			query: () => ({
				url: '/api/v1/auth/logout',
				method: 'POST',
			}),
			async onQueryStarted(arg, { dispatch, queryFulfilled }) {
				try {
					const { data } = await queryFulfilled;
					console.log(data);
					dispatch(logOut());
					// Clears out cache and query substrictions for apiSlice
					setTimeout(() => {
						dispatch(apiSlice.util.resetApiState());
					}, 1000);
				} catch (error) {
					console.log(error);
				}
			},
		}),
		refresh: builder.mutation({
			query: () => ({
				url: '/api/v1/auth/refresh',
				method: 'GET',
			}),
			async onQueryStarted(arg, { dispatch, queryFulfilled }) {
				try {
					const { data } = await queryFulfilled;
					console.log(data);
					const { accessToken } = data;
					dispatch(setCredentials({ accessToken }));
				} catch (error) {
					console.log(error);
				}
			},
		}),
	}),
});

export const { useLoginMutation, useSendLogoutMutation, useRefreshMutation } = authApiSlice;
