import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Public from './components/Public.jsx';
import Login from './components/Login.jsx';
import DashLayout from './components/DashLayout.jsx';
import Welcome from './components/Welcome.jsx';
import NotesList from './components/NotesList.jsx';
import UsersList from './components/UsersList.jsx';
import EditUser from './components/EditUser.jsx';
import NewUserForm from './components/NewUserForm.jsx';
import EditNote from './components/EditNote.jsx';
import NewNote from './components/NewNote.jsx';
import Prefetch from './components/Prefetch.jsx';
import PersistLogin from './components/PersistLogin.jsx';
import RequireAuth from './components/RequireAuth.jsx';
import { ROLES } from './config/roles.jsx';
import useTitle from './hooks/useTitle.jsx';
import { disableReactDevTools } from '@fvilers/disable-react-devtools';
import Error from './components/Error.jsx';

if (process.env.NODE_ENV === 'PRODUCTION MODE') {
	disableReactDevTools();
}

function App() {
	useTitle('ticketMaster Repair');
	return (
		<Routes>
			{/* Layout renders the children */}
			<Route path='/' element={<Layout />}>
				{/* index indicates default component shown at root path */}
				{/* PUBLIC ROUTES */}
				<Route index element={<Public />} />
				<Route path='login' element={<Login />} />

				{/* PROTECTED ROUTES */}

				<Route element={<PersistLogin />}>
					<Route element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}>
						<Route element={<Prefetch />}>
							<Route path='dash' element={<DashLayout />}>
								<Route index element={<Welcome />} />

								<Route element={<RequireAuth allowedRoles={[ROLES.Manager, ROLES.Admin]} />}>
									<Route path='users'>
										<Route index element={<UsersList />} />
										<Route path=':id' element={<EditUser />} />
										<Route path='new' element={<NewUserForm />} />
									</Route>
								</Route>

								<Route path='notes'>
									<Route index element={<NotesList />} />
									<Route path=':id' element={<EditNote />} />
									<Route path='new' element={<NewNote />} />
								</Route>
							</Route>{' '}
							{/* End Dash */}
						</Route>
					</Route>
				</Route>
				{/* END OF PROTECTED ROUTES */}
			</Route>
			<Route path='*' element={<Error />} />
		</Routes>
	);
}

export default App;
