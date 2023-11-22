import { store } from '../context/store.jsx';
import { notesApiSlice } from '../features/notes/notesApiSlice.jsx';
import { usersApiSlice } from '../features/users/usersApiSlice';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

// We wrap our protected pages with this Prefectch component
// This will help us when we refresh page an we still want to have that state
function Prefetch() {
	// Only want this component to reun when component mounts
	// Thus, dependency array on useEffect is empty
	useEffect(() => {
		console.log('SUBSCRIBING');
		// Manual subscription to getNotes query data
		// const notes = store.dispatch(notesApiSlice.endpoints.getNotes.initiate());
		// Manual subscription to getUsers query data
		// const users = store.dispatch(usersApiSlice.endpoints.getUsers.initiate());
		// These subscriptions will remain active; it won't expire in 5 secs or 60 secs
		// This allows us access to data that won't expire in 5 secs or 60 secs.
		// Thus we disabled the keepUnusedDataFor prop in the ApiSlices for notes and users

		// Cleanup gets called when the component unmounts
		// Cleanup also gets called when the dependency array changes and the effect needs to run again
		// But it's the previous effect's cleanup that runs before the next effect function runs
		// Thus we unsubscribe whenever we leave the protected pages

		// No longer need cleanup function
		// return () => {
		//	console.log('UNSUBSCRIBING');
		// 	notes.unsubscribe();
		//	users.unsubscribe();
		// };

		// Using built-in prfetch in redux
		store.dispatch(notesApiSlice.util.prefetch('getNotes', 'notesList', { force: true }));
		store.dispatch(usersApiSlice.util.prefetch('getUsers', 'usersList', { force: true }));
	}, []);

	return <Outlet />;
}
export default Prefetch;
