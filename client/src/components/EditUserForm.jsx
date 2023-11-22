import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { ROLES } from '../config/roles';
import { useDeleteUserMutation, useUpdateUserMutation } from '../features/users/usersApiSlice';
import PropTypes from 'prop-types';

const USER_REGEX = /^[A-z]{3,20}$/;
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/;

function EditUserForm({ user }) {
	const [updateUser, { isLoading, isSuccess, isError, error }] = useUpdateUserMutation();
	const [deleteUser, { isSuccess: isDelSuccess, isError: isDelError, error: delerror }] =
		useDeleteUserMutation();
	const navigate = useNavigate();

	const [username, setUsername] = useState(user.userName);
	const [validUsername, setValidUsername] = useState(false);
	const [password, setPassword] = useState('');
	const [validPassword, setValidPassword] = useState(false);
	const [roles, setRoles] = useState(user.roles);
	const [active, setActive] = useState(user.active);

	// Use Effects
	useEffect(() => {
		setValidUsername(USER_REGEX.test(username));
	}, [username]);

	useEffect(() => {
		setValidPassword(PWD_REGEX.test(password));
	}, [password]);

	// navigage function does not change, but we put it in to remove warning
	useEffect(() => {
		console.log(isSuccess);
		if (isSuccess || isDelSuccess) {
			setUsername('');
			setPassword('');
			setRoles([]);
			navigate('/dash/users');
		}
	}, [isSuccess, isDelSuccess, navigate]);

	// Handlers
	const onUsernameChanged = (e) => setUsername(e.target.value);
	const onPasswordChanged = (e) => setPassword(e.target.value);
	const onRolesChanged = (e) => {
		const values = Array.from(e.target.selectedOptions, (option) => option.value);
		setRoles(values);
	};
	const onActiveChanged = () => setActive((previous) => !previous);
	const onSaveUserClicked = async (e) => {
		if (password) {
			await updateUser({ id: user.id, username, password, roles, active });
			// console.log(isSuccess);
			// if (isSuccess) {
			// 	setUsername('');
			// 	setPassword('');
			// 	setRoles([]);
			// 	navigate('/dash/users');
			// }
		} else {
			await updateUser({ id: user.id, username, roles, active });
			// console.log(isSuccess);
			// if (isSuccess) {
			// 	setUsername('');
			// 	setPassword('');
			// 	setRoles([]);
			// 	navigate('/dash/users');
			// }
		}
	};
	const onDeleteUserClicked = async () => {
		await deleteUser({ id: user.id });
		// if (isDelSuccess) {
		// 	setUsername('');
		// 	setPassword('');
		// 	setRoles([]);
		// 	navigate('/dash/users');
		// }
	};

	const options = Object.values(ROLES).map((role) => {
		return (
			<option key={role} value={role}>
				{role}
			</option>
		);
	});

	let canSave;
	if (password) {
		canSave = [roles.length, validUsername, validPassword].every(Boolean) && !isLoading;
	} else {
		canSave = [roles.length, validUsername].every(Boolean) && !isLoading;
	}

	// Dynamic Classes
	const errClass = isError || isDelError ? 'errmsg' : 'offscreen';
	const validUserClass = !validUsername ? 'form__input--incomplete' : '';
	const validPwdClass = password && !validPassword ? 'form__input--incomplete' : '';
	const validRolesClass = !roles.length ? 'form__input--incomplete' : '';
	// Error Content
	const errContent = (error?.data?.message || delerror?.data?.message) ?? '';

	const content = (
		<>
			<p className={errClass}>{errContent}</p>

			<form className='form' onSubmit={(e) => e.preventDefault()}>
				<div className='form__title-row'>
					<h2>Edit User</h2>
					<div className='form__action-buttons'>
						<button
							className='edit-save-btn'
							title='Save'
							onClick={onSaveUserClicked}
							disabled={!canSave}>
							Save
						</button>
						<button className='edit-delete-btn' title='Delete' onClick={onDeleteUserClicked}>
							Delete
						</button>
					</div>
				</div>
				<label className='form__label' htmlFor='username'>
					Username: <span className='nowrap'>[3-20 letters]</span>
				</label>
				<input
					className={`form__input ${validUserClass}`}
					id='username'
					name='username'
					type='text'
					autoComplete='off'
					value={username}
					onChange={onUsernameChanged}
				/>

				<label className='form__label' htmlFor='password'>
					Password: <span className='nowrap'>[empty = no change]</span>{' '}
					<span className='nowrap'>[4-12 chars incl. !@#$%]</span>
				</label>
				<input
					className={`form__input ${validPwdClass}`}
					id='password'
					name='password'
					type='password'
					autoComplete='off'
					value={password}
					onChange={onPasswordChanged}
				/>

				<label className='form__label form__checkbox-container' htmlFor='user-active'>
					ACTIVE:
					<input
						className='form__checkbox'
						id='user-active'
						name='user-active'
						type='checkbox'
						checked={active}
						onChange={onActiveChanged}
					/>
				</label>

				<label className='form__label' htmlFor='roles'>
					ASSIGNED ROLES:
				</label>
				<select
					id='roles'
					name='roles'
					className={`form__select ${validRolesClass}`}
					multiple={true}
					size='3'
					value={roles}
					onChange={onRolesChanged}>
					{options}
				</select>
			</form>
		</>
	);

	return content;
}

EditUserForm.propTypes = {
	user: PropTypes.shape({
		id: PropTypes.string,
		userName: PropTypes.string,
		roles: PropTypes.array,
		active: PropTypes.bool,
		// Add other properties of user object here
	}).isRequired,
};

export default EditUserForm;
