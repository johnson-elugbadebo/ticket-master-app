import { useSelector } from 'react-redux';
import { selectCurrentToken } from '../features/auth/authSlice';
import { jwtDecode } from 'jwt-decode';

function useAuth() {
	const token = useSelector(selectCurrentToken);
	let isManager = false;
	let isAdmin = false;
	let status = 'Employee';

	if (token) {
		const decoded = jwtDecode(token);
		const { username, roles } = decoded.userInfo;
		isManager = roles.includes('Manager');
		isAdmin = roles.includes('Admin');
		// Whatever we store in status is the highest role available to that user
		if (isManager) status = 'Manager';
		if (isAdmin) status = 'Admin';
		return { username, roles, status, isManager, isAdmin };
	}
	return { username: '', roles: [], isManager, isAdmin, status };
}
export default useAuth;
