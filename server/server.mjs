// Import dotenv and invoke it
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { logEvents, logger } from './middleware/logger.mjs';
import mongoose from 'mongoose';
// Routes
import rootRouter from './routes/rootRoute.mjs'; // must include .mjs
import usersRouter from './routes/usersRoute.mjs'; // must include .mjs
import notesRouter from './routes/notesRoute.mjs'; // must include .mjs
import authRouter from './routes/authRoute.mjs'; // must include .mjs
// Middleware - Error Handler - cookieParser - cors
import { errorHandler } from './middleware/errorHandler.mjs'; // must include .js
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { corsOptions } from './config/corsOptions.mjs';
// Import DB connection
import { connectDB } from './database/connectDB.mjs';

const app = express();
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Log environment
console.log(process.env.NODE_ENV);
// Setup mongodb connection
connectDB(process.env.MONGO_URI);

// Front end static files
app.use(express.static(path.resolve(__dirname, '../client/dist')));
// app.use(express.static(path.join(__dirname, '/public')));

// Custom middleware logger
app.use(logger);
// Cross Origin Resource Sharing
app.use(cors(corsOptions));
// Establish Middleware (json), Makes json data available to us in controllers
app.use(express.json());
app.use(cookieParser());

// app.use('/', rootRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/notes', notesRouter);

app.get('*', (req, res) => {
	res.sendFile(path.resolve(__dirname, '../client/dist', 'index.html'));
});

// Handle Not Found
app.use('*', (req, res) => {
	res.status(404).json({ msg: 'not found' });
});

// app.use('*', (req, res) => {
// 	console.log('HIT NOT FOUND HANDLER');
// 	res.status(404);
// 	if (req.accepts('html')) {
// 		res.sendFile(path.join(__dirname, '/views', '404.html'));
// 	} else if (req.accepts('json')) {
// 		res.json({ error: '404 Page Not Found' });
// 	} else {
// 		res.type('txt').send('404 Page Not Found');
// 	}
// });

// Invoke Error Handler
app.use(errorHandler);

// Start app once connection is established
mongoose.connection.once('open', () => {
	console.log(`SERVER is CONNECTED to DATABASE...`);
	app.listen(PORT, (error) => {
		if (error) throw error;
		console.log(`SERVER is LISTENING on PORT ${PORT}...`);
	});
});

mongoose.connection.on('error', (error) => {
	console.log(`SERVER did NOT CONNECT to DATABASE...`);
	console.log(error);
	logEvents(
		`${error.errno}: ${error.code}\t${error.syscall}\t${error.hostname}`,
		'mongoErrLog.log'
	);
});
