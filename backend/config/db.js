import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: "./backend/.env" });
import dns from "dns";
dns.setServers(["1.1.1.1", "8.8.8.8"]);


const connectDB = async () => {
    try {
        
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Successfully connected to mongoDB 👍");
    } catch (error) {
        console.error(`ERROR: ${error.message}`);
        process.exit(1);
    }
}

export default connectDB;