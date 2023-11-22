// Import Models
import UserModel from '../models/User.mjs'; // must include .mjs
// Import async Handler
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Login
// Method: POST
// Endpoint: /api/v1/auth
// Access: Public
const handleLogin = asyncHandler(async function (req, res) {
	const { username, password } = req.body;
	if (!username || !password)
		return res.status(400).json({ message: 'Username and password are required.' });

	// check if user exists
	const foundUser = await UserModel.findOne({ userName: username }).select('+password').exec();
	if (!foundUser || !foundUser.active) return res.status(401).json({ message: 'Unauthorized.' }); //Unauthorized
	// evaluate password
	const match = await bcrypt.compare(password, foundUser.password);
	if (!match) return res.status(401).json({ message: 'Unauthorized.' });

	const accessToken = jwt.sign(
		{ userInfo: { username: foundUser.userName, roles: foundUser.roles } },
		process.env.ACCESS_TOKEN_SECRET,
		{ expiresIn: '15m' }
	);
	const refreshToken = jwt.sign(
		{ username: foundUser.userName },
		process.env.REFRESH_TOKEN_SECRET,
		{ expiresIn: '1d' }
	);
	// when you create cookie add secure: true option which only serves on https
	res.cookie('jwt', refreshToken, {
		httpOnly: true, // accessible only by web server
		sameSite: 'None', // cross-site cookie
		secure: true, // https
		maxAge: 7 * 24 * 60 * 60 * 1000, // cookie expirty: set to match refreshToken
	});

	// Saving refershToken with current user
	// foundUser.refreshToken = refreshToken;
	// const result = await foundUser.save();
	// console.log(result);
	// No need to send roles to front end since they are in accessToken
	// res.json({ roles, accessToken });
	res.json({ accessToken });
});

// Refresh
// Method: GET
// Endpoint: /api/v1/auth/refresh
// Access: Public - because accessToken has expired
const handleRefreshToken = function (req, res) {
	const cookies = req.cookies;
	if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized.' }); // Unauthroized
	// console.log(cookies.jwt);
	const refreshToken = cookies.jwt;

	// check if user exists
	// const foundUser = await User.findOne({ refreshToken: refreshToken }).exec();
	// if (!foundUser) return res.sendStatus(403); //Forbidden
	// evaluate jwt
	jwt.verify(
		refreshToken,
		process.env.REFRESH_TOKEN_SECRET,
		asyncHandler(async (err, decoded) => {
			if (err) return res.status(403).json({ message: 'Forbidden.' }); //Forbidden
			const foundUser = await UserModel.findOne({ userName: decoded.username }).exec();
			if (!foundUser) return res.status(401).json({ message: 'Unauthorized.' }); //Unauthorized

			// Create New accessToken
			const accessToken = jwt.sign(
				{ userInfo: { username: foundUser.userName, roles: foundUser.roles } },
				process.env.ACCESS_TOKEN_SECRET,
				{
					expiresIn: '15m',
				}
			);
			// No need to send roles to front end since they are in accessToken
			// res.json({ roles, accessToken });
			res.json({ accessToken });
		})
	);
};

// Logout
// Method: POST
// Endpoint: /api/v1/auth/logout
// Access: Public - just to clear cookie if it exists
const handleLogout = function (req, res) {
	// On client, also delete the accessToken
	const cookies = req.cookies;
	if (!cookies?.jwt) return res.sendStatus(204); // Succesful, but no Content to Send Back
	// console.log(cookies.jwt);
	// const refreshToken = cookies.jwt;

	// Is refreshToken in DB?
	// const foundUser = await User.findOne({ refreshToken: refreshToken }).exec();
	// if (!foundUser) {
	//	res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
	//		return res.sendStatus(204); // Succesful, but no Content to Send Back
	// }

	// Delete refreshToken from DB
	// foundUser.refreshToken = '';
	//const result = await foundUser.save();
	// console.log(result);

	// From express site: Web browsers and other compliant clients will only clear the cookie if the given options is identical to those given to res.cookie(), excluding expires and maxAge.
	res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true }); // when you create cookie add secure: true option which only serves on https
	return res.status(200).json({ message: 'Cookie cleared' }); // Succesful
};

export { handleLogin, handleRefreshToken, handleLogout };
