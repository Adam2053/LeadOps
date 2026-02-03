import mongoose from "mongoose";

const dbConnection = async (dbURL) => {
    try {
        await mongoose.connect(dbURL);
        console.log("Mongo DB connected successfully");
    } catch (error) {
        console.log("Failed to connect to Database: ", error.message);
    }
}

export default dbConnection;