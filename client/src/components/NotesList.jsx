import { useGetNotesQuery } from '../features/notes/notesApiSlice.jsx';
import Note from './Note.jsx';
import useAuth from '../hooks/useAuth.jsx';
import PulseLoader from 'react-spinners/PulseLoader.js';
import useTitle from '../hooks/useTitle.jsx';

function NotesList() {
	useTitle('ticketMaster Repair: Ticket List');

	const { username, isManager, isAdmin } = useAuth();
	const {
		data: notes,
		isLoading,
		isSuccess,
		isError,
		error,
	} = useGetNotesQuery('notesList', {
		// Allows a query to automatically refetch on a provided interval, specified in milliseconds
		// every 15secs, it re-queries data
		pollingInterval: 15000,
		// if we focus on another window, and come back to browser window
		refetchOnFocus: true,
		// refetch if you remount component
		refetchOnMountOrArgChange: true,
	});
	// console.log(notes);
	let content;

	if (isLoading) content = <PulseLoader color={'#FFF'} />;

	if (isError) {
		content = <p className='errmsg'>{error?.data?.message}</p>;
	}

	if (isSuccess) {
		const { ids, entities } = notes;
		// console.log(ids);
		console.log(entities);

		let filteredIds;
		if (isManager || isAdmin) {
			filteredIds = [...ids];
		} else {
			filteredIds = ids.filter((noteId) => entities[noteId].username === username);
		}

		const tableContent =
			ids?.length && filteredIds.map((noteId) => <Note key={noteId} noteId={noteId} />);

		content = (
			<table className='table table--notes'>
				<thead className='table__thead'>
					<tr>
						<th scope='col' className='table__th note__status'>
							Username
						</th>
						<th scope='col' className='table__th note__created'>
							Created
						</th>
						<th scope='col' className='table__th note__updated'>
							Updated
						</th>
						<th scope='col' className='table__th note__title'>
							Title
						</th>
						<th scope='col' className='table__th note__username'>
							Owner
						</th>
						<th scope='col' className='table__th note__edit'>
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
export default NotesList;
