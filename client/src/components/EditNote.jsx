import { useParams } from 'react-router-dom';
// import { useSelector } from 'react-redux';
import { useGetNotesQuery } from '../features/notes/notesApiSlice';
// import { selectAllUsers } from '../features/users/usersApiSlice';
import EditNoteForm from './EditNoteForm';
import useAuth from '../hooks/useAuth.jsx';
import { useGetUsersQuery } from '../features/users/usersApiSlice';
import PulseLoader from 'react-spinners/PulseLoader';
import useTitle from '../hooks/useTitle';

function EditNote() {
	useTitle('ticketMaster Repair: Edit Ticket');
	const { username, isManager, isAdmin } = useAuth();
	const { id } = useParams();
	// const note = useSelector((state) => selectNoteById(state, id));
	// const users = useSelector(selectAllUsers);
	const { note } = useGetNotesQuery('notesList', {
		selectFromResult: ({ data }) => ({
			note: data?.entities[id],
		}),
	});
	// The Ids array are iterable (we can map over them), the entities are not
	const { users } = useGetUsersQuery('usersList', {
		selectFromResult: ({ data }) => ({
			users: data?.ids.map((id) => data?.entities[id]),
		}),
	});

	if (!note || !users?.length) return <PulseLoader color={'#FFF'} />;
	if (!isManager && !isAdmin) {
		if (note.username !== username) {
			return <p className='errmsg'>No access</p>;
		}
	}
	const content = <EditNoteForm note={note} users={users} />;
	return content;
}

export default EditNote;
