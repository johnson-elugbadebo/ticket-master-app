import { useLocation, Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth.jsx';

function RequireAuth({ allowedRoles }) {
	const { roles } = useAuth();
	const location = useLocation();

	const content = roles.some((role) => allowedRoles.includes(role)) ? (
		<Outlet />
	) : (
		<Navigate to='/login' state={{ from: location }} replace />
	);
	return content;
}
export default RequireAuth;
