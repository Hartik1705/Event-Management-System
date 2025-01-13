import mongoose from "mongoose";

const connectDB = async()=>{

    const mongoURL = process.env.MONGO_URL;

    try{
        mongoose.connection.on('connected', () =>{
            console.log('Connected to mongoDB');
        });

        await mongoose.connect(mongoURL);
    }
    catch(err){
        console.log(err);
    }
}

export default connectDB;