import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setCredentials } from '../features/auth/authSlice';

// Adding accessToken to Data Fetching Workflow
const baseQuery = fetchBaseQuery({
	baseUrl: 'https://ticket-master-app-a9h7.onrender.com',
	credentials: 'include', // this always includes the secure httpOnly cookie
	prepareHeaders: (headers, { getState }) => {
		const token = getState().auth.token;
		if (token) {
			headers.set('authorization', `Bearer ${token}`);
		}
		return headers;
	},
});

// Adding refreshToken to Data Fetching Workflow
const baseQueryWithReauth = async (args, api, extraOptions) => {
	// console.log(args) // request url, method, body
	// console.log(api) // signal, dispatch, getState()
	// console.log(extraOptions) // this will be undefined unless you pass in a value like {shout: true}

	let result = await baseQuery(args, api, extraOptions);

	// If you want, handle other status codes too...
	if (result?.error?.status === 403) {
		console.log('SENDING REFRESH TOKEN');

		// Send the refreshToken to get new accessToken
		const refreshResult = await baseQuery('/api/v1/auth/refresh', api, extraOptions);
		if (refreshResult?.data) {
			// Store new accessToken
			api.dispatch(setCredentials({ ...refreshResult.data }));
			// Retry original query with new accessToken
			result = await baseQuery(args, api, extraOptions);
		} else {
			if (refreshResult?.error?.status === 403) {
				refreshResult.error.data.message = 'Your login has expired.';
			}
			return refreshResult;
		}
	}

	return result;
};

export const apiSlice = createApi({
	baseQuery: baseQueryWithReauth,
	tagTypes: ['Note', 'User'],
	endpoints: () => ({}),
});
