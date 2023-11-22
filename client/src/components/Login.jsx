import { useRef, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { useDispatch } from 'react-redux';
import { useLoginMutation } from '../features/auth/authApiSlice';
import { setCredentials } from '../features/auth/authSlice';

import usePersist from '../hooks/usePersist.jsx';
import PulseLoader from 'react-spinners/PulseLoader';

function Login() {
	const userRef = useRef();
	const errRef = useRef();

	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [errMsg, setErrMsg] = useState('');
	const [persist, setPersist] = usePersist('');

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [login, { isLoading }] = useLoginMutation();

	useEffect(() => {
		userRef.current.focus();
	}, []);

	useEffect(() => {
		setErrMsg('');
	}, [username, password]);

	// Handlers
	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const { accessToken } = await login({ username, password }).unwrap();
			dispatch(setCredentials({ accessToken }));
			setUsername('');
			setPassword('');
			navigate('/dash');
		} catch (error) {
			if (!error.status) {
				setErrMsg('No Server Response');
			} else if (error.status === 400) {
				setErrMsg('Missing Username or Password');
			} else if (error.status === 401) {
				setErrMsg('Unauthorized');
			} else {
				setErrMsg(error.data?.message);
			}
			errRef.current.focus();
		}
	};

	const handleUserInput = (e) => {
		return setUsername(e.target.value);
	};
	const handlePwdInput = (e) => {
		return setPassword(e.target.value);
	};
	const handleToggle = () => {
		return setPersist((previous) => !previous);
	};

	const onBacktoHome = () => navigate('/');

	const errClass = errMsg ? 'errmsg' : 'offscreen';

	if (isLoading) return <PulseLoader color={'#FFF'} />;

	const content = (
		<section className='public'>
			<header>
				<h1>Employee Login</h1>
			</header>
			<main className='login'>
				<p ref={errRef} className={errClass} aria-live='assertive'>
					{errMsg}
				</p>

				<form className='form' onSubmit={handleSubmit}>
					<label htmlFor='username'>Username:</label>
					<input
						className='form__input'
						type='text'
						id='username'
						ref={userRef}
						value={username}
						onChange={handleUserInput}
						autoComplete='off'
						required
					/>

					<label htmlFor='password'>Password:</label>
					<input
						className='form__input'
						type='password'
						id='password'
						autoComplete='off'
						onChange={handlePwdInput}
						value={password}
						required
					/>
					<button className='form__submit-button'>Sign In</button>

					<label htmlFor='persist' className='form__persist'>
						<input
							type='checkbox'
							className='form__checkbox'
							id='persist'
							onChange={handleToggle}
							checked={persist}
						/>
						Trust This Device
					</label>
					<button className='form__back-home' onClick={onBacktoHome}>
						Back to Home
					</button>
				</form>
			</main>
			<footer>{/* <Link to='/'>Back to Home</Link> */}</footer>
		</section>
	);

	return content;
}
export default Login;
