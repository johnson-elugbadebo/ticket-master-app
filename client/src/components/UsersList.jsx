import PulseLoader from 'react-spinners/PulseLoader.js';
import { useGetUsersQuery } from '../features/users/usersApiSlice.jsx';
import User from './User.jsx';
import useTitle from '../hooks/useTitle.jsx';

function UsersList() {
	useTitle('ticketMaster Repair: Users List');

	const {
		data: users,
		isLoading,
		isSuccess,
		isError,
		error,
	} = useGetUsersQuery('usersList', {
		// every 60secs, it requeries data
		pollingInterval: 60000,
		// if we focus on another window, and come back to browser window
		refetchOnFocus: true,
		// refetch if you remount component
		refetchOnMountOrArgChange: true,
	});

	// console.log(users);
	let content;

	if (isLoading) content = <PulseLoader color={'#FFF'} />;

	if (isError) {
		content = <p className='errmsg'>{error?.data?.message}</p>;
	}

	if (isSuccess) {
		const { ids } = users;

		const tableContent = ids?.length && ids.map((userId) => <User key={userId} userId={userId} />);

		content = (
			<table className='table table--users'>
				<thead className='table__thead'>
					<tr>
						<th scope='col' className='table__th user__username'>
							Username
						</th>
						<th scope='col' className='table__th user__roles'>
							Roles
						</th>
						<th scope='col' className='table__th user__edit'>
							Edit
						</th>
					</tr>
				</thead>
				<tbody>{tableContent}</tbody>
			</table>
		);
	}

	return content;
}
export default UsersList;
