import express from 'express';
const router = express.Router();
import {
	getAllUsers,
	createNewUser,
	updateUser,
	deleteUser,
} from '../controllers/usersController.mjs';
import { verifyJWT } from '../middleware/verifyJWT.mjs';

router.get('/', verifyJWT, getAllUsers);
router.post('/', verifyJWT, createNewUser);
router.patch('/', verifyJWT, updateUser);
router.delete('/', verifyJWT, deleteUser);

export default router;
