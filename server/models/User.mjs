// Import Mongoose
import mongoose from 'mongoose';
// Import Validator to validate email addresses
// import validator from 'validator';

// Create Schema, which defines Structure for the Document you're creating
// Add in Validation into Schema with properties for each field
// A Model is a Wrapper for the Schema, an Interface to the DB
// Using a model, you can easily perform CRUD on your DB
const UserSchema = new mongoose.Schema(
	{
		userName: {
			type: String,
			trim: true,
			minLength: [3, 'Username must be at least 3 characters'],
			maxLength: [15, 'Username cannot be more than 15 characters'],
			required: [true, 'Please provide a username'],
			unique: [true, 'That username is taken.'], // user must submit a username that is unique, not already in use
		},

		password: {
			type: String,
			required: [true, 'Please provide password'],
			minLength: [6, 'Password must be at least 6 characters'],
			select: false, // password still returns b/c of user.create in register user controller
		},
		roles: { type: [String], default: ['Employee'] },
		active: { type: Boolean, default: true },
	},
	{ timestamps: true }
);

// Compile model from Schema
// Parameters when exporting are model name and schema
export default mongoose.model('User', UserSchema);
