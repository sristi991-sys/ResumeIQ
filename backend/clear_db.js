import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

async function clearDB() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fairhire');
        
        console.log('Clearing Candidates...');
        await mongoose.connection.collection('candidates').deleteMany({});
        
        console.log('Clearing Evaluations...');
        await mongoose.connection.collection('evaluations').deleteMany({});
        
        console.log('Clearing Roles...');
        await mongoose.connection.collection('roles').deleteMany({});
        
        console.log('✅ Database cleared successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error clearing database:', error);
        process.exit(1);
    }
}

clearDB();
