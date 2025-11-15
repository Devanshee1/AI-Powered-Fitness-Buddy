import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    // Remove deprecated options - they're no longer needed in newer versions
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
    console.log(`✅ Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // Don't exit the process - allow the app to run without MongoDB
    console.log('⚠️  Running without database. User data will not persist.');
    console.log('💡 Make sure to add your MongoDB Atlas connection string to .env');
  }
};

export default connectDB;
