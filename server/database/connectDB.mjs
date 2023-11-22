import mongoose from 'mongoose';

async function connectDB(url) {
	try {
		mongoose.set('strictQuery', true);
		await mongoose.connect(url, {
			dbName: 'GRAY-MERN-STACK',
			maxPoolSize: 100,
			minPoolSize: 50,
		});
	} catch (error) {
		console.log(error);
	}
}

export { connectDB };
