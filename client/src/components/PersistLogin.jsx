import { Outlet, Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRefreshMutation } from '../features/auth/authApiSlice';
import usePersist from '../hooks/usePersist';
import { selectCurrentToken } from '../features/auth/authSlice';
import PulseLoader from 'react-spinners/PulseLoader';

function PersistLogin() {
	const [persist] = usePersist();
	const token = useSelector(selectCurrentToken);
	const effectRun = useRef(false);

	const [trueSuccess, setTrueSuccess] = useState(false);

	const [refresh, { isUninitialized, isLoading, isSuccess, isError, error }] = useRefreshMutation();

	useEffect(() => {
		if (effectRun.current === true || process.env.NODE_ENV !== 'DEVELOPMENT') {
			// React 18 Strict Mode

			const verifyRefreshToken = async () => {
				console.log('verifying refresh token');
				try {
					// const response =
					await refresh();
					// const {accessToken} = response.data
					setTrueSuccess(true);
				} catch (error) {
					console.log(error);
				}
			};

			if (!token && persist) verifyRefreshToken();
		}

		return () => (effectRun.current = true);
		// eslint-disable-next-line
	}, []);

	let content;
	if (!persist) {
		// persist: no
		console.log('NO PERSIST');
		content = <Outlet />;
	} else if (isLoading) {
		// persist: yes, token: no
		console.log('LOADING');
		content = <PulseLoader color={'#FFF'} />;
	} else if (isError) {
		// persist: yes, token: no
		console.log('ERROR');
		content = (
			<p className='errmsg'>
				{`${error?.data?.message} - `}
				<Link to='/login'>Please login again</Link>.
			</p>
		);
	} else if (isSuccess && trueSuccess) {
		// persist: yes, token: yes
		console.log('SUCCESS');
		content = <Outlet />;
	} else if (token && isUninitialized) {
		// persist: yes, token: yes
		console.log('TOKEN & UNINITIALIZED');
		console.log(isUninitialized);
		content = <Outlet />;
	}

	return content;
}
export default PersistLogin;
