// Import Models
import UserModel from '../models/User.mjs'; // must include .mjs
import NoteModel from '../models/Note.mjs'; // must include .mjs
// Import async Handler
import asyncHandler from 'express-async-handler';
// Import bcrypt
import bcrypt from 'bcrypt';

// Get all Users
// Method: Get
// Endpoint: /users
// Access: Private
const getAllUsers = asyncHandler(async function (req, res) {
	const users = await UserModel.find().lean().exec();
	if (!users?.length) {
		return res.status(400).json({ message: 'No users found' }); // Bad Request
	}
	res.status(200).json({ users: users });
});

// Lean()
// with lean, you don't return full mongoose documents; you lose:
// Change tracking
// Casting and validation
// Getters and setters
// Virtuals
// save()

// Create User
// Method: Post
// Endpoint: /users
// Access: Private
const createNewUser = asyncHandler(async function (req, res) {
	const { username, password, roles } = req.body;
	// Confirm data and no empty fields
	if (!username || !password) {
		return res.status(400).json({ message: 'All fields are required' }); // Bad Request
	}

	// Check for duplicates
	const userAlreadyExists = await UserModel.findOne({ userName: username })
		.collation({ locale: 'en', strength: 2 }) // makes query case insentive, Dave === dave
		.lean()
		.exec();
	if (userAlreadyExists) {
		return res.status(409).json({ message: 'User name already in use.' }); // Conflict
	}

	// Hash Password
	const hashedPassword = await bcrypt.hash(password, 10);

	const userObject =
		!Array.isArray(roles) || !roles.length
			? { userName: username, password: hashedPassword }
			: { userName: username, password: hashedPassword, roles: roles };

	// Create and store new user
	const user = await UserModel.create(userObject);

	if (user) {
		res.status(201).json({ message: `New user ${username} created` });
	} else {
		res.status(400).json({ message: `Invalid user data received` });
	}
});

// Update User
// Method: Patch
// Endpoint: /users
// Access: Private
const updateUser = asyncHandler(async function (req, res) {
	const { id, username, roles, active, password } = req.body;
	// Confirm data and no empty fields
	if (!id || !username || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean') {
		return res.status(400).json({ message: 'All fields are required' }); // Bad Request
	}

	// We don't want to call lean here, becauwse we want the full mongoose document
	const user = await UserModel.findById(id).exec();
	if (!user) {
		return res.status(400).json({ message: 'User not found' }); // Bad request
	}

	// Check for duplicates
	const duplicate = await UserModel.findOne({ userName: username }).collation({
		locale: 'en',
		strength: 2,
	}); // makes query case insentive, Dave === dave.lean().exec();
	// Allow updates to the original user only
	if (duplicate && duplicate?._id.toString() !== id) {
		return res.status(409).json({ message: 'User name already in use.' }); // Conflict
	}
	user.userName = username;
	user.roles = roles;
	user.active = active;

	// We don't want to require someone to always update a password

	if (password) {
		// Hash Password
		user.password = await bcrypt.hash(password, 10);
	}

	// if there is an error on save, it will be caught with the async handler
	const updatedUser = await user.save();
	res.status(200).json({ message: `${updatedUser.userName} updated` });
});

// Delete User
// Method: Delete
// Endpoint: /users
// Access: Private
const deleteUser = asyncHandler(async function (req, res) {
	const { id } = req.body;
	if (!id) {
		return res.status(400).json({ message: 'User ID is required' }); // Bad Request
	}
	// Don't want to delete a specific user if they have notes asigned to them
	const note = await NoteModel.findOne({ user: id }).lean().exec();
	if (note) {
		return res.status(400).json({ message: 'User has assigned notes' }); // Bad Request
	}

	const user = await UserModel.findById(id).exec();
	if (!user) {
		return res.status(400).json({ message: 'User not found' }); // Badd request
	}
	// Responds with deleted users information
	// Finds a matching document, removes it, and returns the found document (if any).
	// findByIdAndDelete(id) is a shorthand for findOneAndDelete({ _id: id })
	const result = await UserModel.findByIdAndDelete(id).exec();
	res.status(200).json({ message: `Username ${result.userName} with ID ${result._id} deleted` });
});

export { getAllUsers, createNewUser, updateUser, deleteUser };
