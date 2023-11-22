import { Outlet } from 'react-router-dom';
import DashHeader from './DashHeader';
import DashFooter from './DashFooter';

// Part of the dashboard after user has logged in
function DashLayout() {
	return (
		<>
			<DashHeader />
			<div className='dash-container'>
				<Outlet />
			</div>
			<DashFooter />
		</>
	);
}
export default DashLayout;
