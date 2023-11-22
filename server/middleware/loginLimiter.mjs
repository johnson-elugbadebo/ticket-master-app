import rateLimit from 'express-rate-limit';
import { logEvents } from './logger.mjs';

const loginLimiter = rateLimit({
	windowMs: 60 * 1000, // 1 minute
	max: 5, // Limit each IP to 5 login requests per `window` (here, per 1 minute)
	message: 'Too many requests from this IP, please try again later.',
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
	handler: (req, res, next, options) => {
		logEvents(
			`Too Many Requests: ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
			'errLog.log'
		);
		res.status(options.statusCode).send(options.message);
	},
});

export { loginLimiter };
