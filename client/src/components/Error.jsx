import { Link } from 'react-router-dom';

function Error() {
	// const error = useRouteError();
	// console.log(error);
	// if (error.status === 404) {
	// 	return (
	// 		<main className='not-found'>
	// 			<div>
	// 				<h1>Sorry! Page not Found.</h1>
	// 				<p>The resource you have requested does not exist.</p>
	// 				<Link to='/dash'>Back home</Link>
	// 			</div>
	// 		</main>
	// 	);
	// }
	return (
		<main className='not-found'>
			<div>
				<h1>Many apologies! Page not Found.</h1>
				<p>The resource you have requested does not exist.</p>
				<Link to='/dash'>Back home</Link>
			</div>
		</main>
	);
}
export default Error;
