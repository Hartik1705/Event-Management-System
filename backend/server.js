import express from 'express';
import connectDB from './config/mongodb.js';
import userRouter from './routes/userRoute.js';
import cors from 'cors';
import eventRouter from './routes/eventRoute.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

const app = express();
const port = 3000;

//middleware
app.use(express.json());
app.use(cors());

//env
dotenv.config();

//db connection
connectDB();

app.use('/user', userRouter);
app.use('/event', eventRouter);


app.listen(port, () =>{
    console.log(`Server is running`);
})