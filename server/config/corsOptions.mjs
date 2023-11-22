import allowedOrigins from './allowedOrigins.mjs';

// Development configuration
// const corsOptions = {
// 	origin: (origin, callback) => {
// 		if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
// 			callback(null, true);
// 		} else {
// 			callback(new Error('Not allowed by CORS'));
// 		}
// 	},
// 	credentials: true,
// 	optionsSuccessStatus: 200,
// };

// Production configuration
const corsOptions = {
	origin: '*',
	credentials: true,
	optionsSuccessStatus: 200,
};

export { corsOptions };
