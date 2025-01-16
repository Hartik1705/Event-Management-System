import express from 'express';
import connectDB from './config/mongodb.js';
import userRouter from './routes/userRoute.js';
import cors from 'cors';
import eventRouter from './routes/eventRoute.js';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';



const app = express();
const port = 3000;

//middleware
app.use(express.json());
app.use(cors());
app.use("/file",express.static(path.join(import.meta.dirname  , 'uploads')))

//env
dotenv.config();

//db connection
connectDB();

app.use('/user', userRouter);
app.use('/event', eventRouter);



app.listen(port, () =>{
    console.log(`Server is running`);
})


