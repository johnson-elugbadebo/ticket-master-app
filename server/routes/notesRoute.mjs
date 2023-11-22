import express from 'express';
const router = express.Router();
import {
	getAllNotes,
	createNewNote,
	updateNote,
	deleteNote,
} from '../controllers/notesController.mjs';
import { verifyJWT } from '../middleware/verifyJWT.mjs';

router.get('/', verifyJWT, getAllNotes);
router.post('/', verifyJWT, createNewNote);
router.patch('/', verifyJWT, updateNote);
router.delete('/', verifyJWT, deleteNote);

export default router;
