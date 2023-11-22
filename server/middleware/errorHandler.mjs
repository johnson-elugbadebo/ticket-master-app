import { logEvents } from './logger.mjs';

// This overrides the default express ErrorHandler
function errorHandler(err, req, res, next) {
	logEvents(
		`${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
		'errLog.log'
	);
	console.log(err.stack);
	const status = res.statusCode ? res.statusCode : 500; // server error
	// RTK Query will look for isError: true
	res.status(status).json({ message: err.message, isError: true });
}

export { errorHandler };
