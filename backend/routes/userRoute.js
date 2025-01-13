import express from 'express';
import { getUsers, loginUser, registerUser } from '../controllers/userController.js';
import userAuth from '../middleware/authMiddleware.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);



//user informatio
userRouter.get('/getUsers', userAuth, getUsers);
export default userRouter;