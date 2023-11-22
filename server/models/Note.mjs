// Import Mongoose
import mongoose from 'mongoose';
import Inc from '@mamunonweb/mongoose-sequence';
const AutoIncrement = Inc(mongoose);
// Import Validator to validate email addresses
// import validator from 'validator';

// Create Schema, which defines Structure for the Document you're creating
// Add in Validation into Schema with properties for each field
// A Model is a Wrapper for the Schema, an Interface to the DB
// Using a model, you can easily perform CRUD on your DB
const NoteSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Types.ObjectId,
			required: [true],
			ref: 'User',
		},
		title: {
			type: String,
			required: [true, 'Please provide title'],
		},
		text: {
			type: String,
			required: [true, 'Please provide text'],
		},
		completed: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

NoteSchema.plugin(AutoIncrement, {
	inc_field: 'ticket',
	id: 'ticketNums',
	start_seq: 500,
});

// Compile model from Schema
// Parameters when exporting are model name and schema
export default mongoose.model('Note', NoteSchema);
