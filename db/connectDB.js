import mongoose from "mongoose";

const connectDB = async (DATABASEURL) =>{
    const DB_OPTIONS = {
        dbName: "Portfolio",
    }
    const data = await mongoose.connect(DATABASEURL, DB_OPTIONS);
    if(data){
        console.log("Database Connected Successfully");
    }
}

export default connectDB;