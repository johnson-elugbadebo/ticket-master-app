import { Link, useNavigate } from 'react-router-dom';

function Public() {
	const navigate = useNavigate();
	const onButtonClicked = () => navigate('/login');
	const content = (
		<section className='public'>
			<header>
				<h1>MERN Stack Ticketing System for A Repair Shop</h1>
			</header>
			<main className='public__main'>
				<div className='public__addr'>
					<strong>BUILT BY:</strong> JOHNSON ELUGBADEBO
					<br />
					<strong>DATE:</strong> FALL 2023
					<br />
					<strong>LOCATION:</strong> CAMBRIDGE, MA
					<br />
					<strong>TECHNOLOGY STACK:</strong> MERN
				</div>
				<br />
				<ul>
					<li
						className=''
						style={{
							listStyleType: 'none',
						}}>
						Database: MongoDB
					</li>
					<li
						className=''
						style={{
							listStyleType: 'none',
						}}>
						Backend framework: Express.js
					</li>
					<li
						className=''
						style={{
							listStyleType: 'none',
						}}>
						Frontend framework: React.js
					</li>
					<li
						className=''
						style={{
							listStyleType: 'none',
						}}>
						Server language: Node.js
					</li>
				</ul>
				<br />
				<div>
					<button type='button' onClick={onButtonClicked} className='login-btn'>
						Employee Login
					</button>
				</div>
			</main>
			<footer></footer>
		</section>
	);

	return content;
}
export default Public;
