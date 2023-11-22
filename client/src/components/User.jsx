import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import { selectUserById } from '../features/users/usersApiSlice';
import { useGetUsersQuery } from '../features/users/usersApiSlice';
import PropTypes from 'prop-types';
import { memo } from 'react';

function User({ userId }) {
	// const user = useSelector((state) => selectUserById(state, userId));
	// console.log(user);

	const { user } = useGetUsersQuery('usersList', {
		selectFromResult: ({ data }) => ({
			user: data?.entities[userId],
		}),
	});

	const navigate = useNavigate();

	if (user) {
		const handleEdit = () => navigate(`/dash/users/${userId}`);
		const userRolesString = user.roles.toString().replaceAll(',', ', ');
		const cellStatus = user.active ? '' : 'table__cell--inactive';

		return (
			<tr className='table__row user'>
				<td className={`table__cell ${cellStatus}`}>{user.userName}</td>
				<td className={`table__cell ${cellStatus}`}>{userRolesString}</td>
				<td className={`table__cell ${cellStatus}`}>
					<button className='icon-button table__button' onClick={handleEdit}>
						<FontAwesomeIcon icon={faPenToSquare} />
					</button>
				</td>
			</tr>
		);
	} else return null;
}

User.propTypes = {
	userId: PropTypes.string.isRequired,
};

const memoizedUser = memo(User);

export default memoizedUser;
