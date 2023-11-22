// Import Models
import UserModel from '../models/User.mjs'; // must include .mjs
import NoteModel from '../models/Note.mjs'; // must include .mjs
// Import async Handler
import asyncHandler from 'express-async-handler';
// Import bcrypt

// Get all Notes
// Method: Get
// Endpoint: /notes
// Access: Private
const getAllNotes = asyncHandler(async function (req, res) {
	const notes = await NoteModel.find().lean().exec();

	// If no notes are found
	if (!notes?.length) {
		return res.status(400).json({ message: 'No notes found' }); // Bad Request
	}

	// Add username to each note before sending the response
	// See Promise.all with map() to get serialized data here: https://youtu.be/4lqJBBEpjRE
	// You could also do this with a for...of loop
	const notesWithUser = await Promise.all(
		notes.map(async (note) => {
			const user = await UserModel.findById(note.user).lean().exec();
			return { ...note, username: user.userName };
		})
	);

	res.status(200).json({ notesWithUser: notesWithUser });
});

// Lean()
// with lean, you don't return full mongoose documents; you lose:
// Change tracking
// Casting and validation
// Getters and setters
// Virtuals
// save()

// Create New Note
// Method: Post
// Endpoint: /notes
// Access: Private
const createNewNote = asyncHandler(async (req, res) => {
	const { user, title, text } = req.body;

	// Confirm data
	if (!user || !title || !text) {
		return res.status(400).json({ message: 'All fields are required' });
	}

	// Check for duplicate title
	const duplicate = await NoteModel.findOne({ title })
		.collation({ locale: 'en', strength: 2 }) // makes query case insentive, Dave === dave
		.lean()
		.exec();

	if (duplicate) {
		return res.status(409).json({ message: 'Duplicate note title' });
	}

	// Create and store the new user
	const note = await NoteModel.create({ user, title, text });

	if (note) {
		// Created
		return res.status(201).json({ message: 'New note created' });
	} else {
		return res.status(500).json({ message: 'Invalid note data received' });
	}
});

// Update a Note
// Method: Patch
// Endpoint: /notes
// Access: Private
const updateNote = asyncHandler(async function (req, res) {
	const { id, user, title, text, completed } = req.body;
	// Confirm data and no empty fields
	if (!id || !user || !title || !text || typeof completed !== 'boolean') {
		return res.status(400).json({ message: 'All fields are required' }); // Bad Request
	}

	// Confirm note exists to update
	// We don't want to call lean here, becauwse we want the full mongoose document
	const note = await NoteModel.findById(id).exec();
	if (!note) {
		return res.status(400).json({ message: 'Note not found' }); // Badd request
	}

	// Check for duplicates
	// Collation makes query case insentive, Dave === dave
	const duplicate = await NoteModel.findOne({ title: title })
		.collation({ locale: 'en', strength: 2 })
		.lean()
		.exec();
	// Allow updates to the original note
	if (duplicate && duplicate?._id.toString() !== id) {
		return res.status(409).json({ message: 'Note title already in use.' }); // Conflict
	}

	note.user = user;
	note.title = title;
	note.text = text;
	note.completed = completed;

	// if there is an error on save, it will be caught with the async handler
	const updatedNote = await note.save();
	res.status(200).json({ message: `${updatedNote.title} updated` });
});

// Delete a Note
// Method: Delete
// Endpoint: /notes
// Access: Private
const deleteNote = asyncHandler(async function (req, res) {
	const { id } = req.body;
	// Confirm data and no empty fields
	if (!id) {
		return res.status(400).json({ message: 'Note ID is required' }); // Bad Request
	}
	// Confirm Note exists to delete
	const note = await NoteModel.findById(id).exec();
	if (!note) {
		return res.status(400).json({ message: 'Note not found' }); // Bad Request
	}

	// Responds with deleted note information
	// Finds a matching document, removes it, and returns the found document (if any).
	// findByIdAndDelete(id) is a shorthand for findOneAndDelete({ _id: id })
	const result = await NoteModel.findByIdAndDelete(id).exec();
	res.status(200).json({ message: `Note ${result.title} with ID ${result._id} deleted` });
});

export { getAllNotes, createNewNote, updateNote, deleteNote };
