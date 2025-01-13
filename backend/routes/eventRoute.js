import express from 'express';
import { createEvent, deleteEvent, getEvents, getParticularEvent, getPreviousEvents, updateEvent,  } from '../controllers/eventController.js';
import userAuth from '../middleware/authMiddleware.js';

const eventRouter = express.Router();

eventRouter.post('/createEvent', userAuth,  createEvent);
eventRouter.post('/deleteEvent',userAuth, deleteEvent);
eventRouter.post('/updateEvent', userAuth, updateEvent )

eventRouter.get('/getEvents',userAuth, getEvents)
eventRouter.get('/getParticularEvent/:id',userAuth, getParticularEvent);
eventRouter.get('/getPreviousEvents', userAuth, getPreviousEvents);



export default eventRouter;