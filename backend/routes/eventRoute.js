import express from 'express';
import { createEvent, deleteEvent, exportParticipant, fetchEmails, getEvents, getParticularEvent, getPreviousEvents, updateEvent,  } from '../controllers/eventController.js';
import userAuth from '../middleware/authMiddleware.js';
import upload from '../middleware/multer.js';

const eventRouter = express.Router();

eventRouter.post('/createEvent',  userAuth,  createEvent);
eventRouter.post('/deleteEvent',userAuth, deleteEvent);
eventRouter.post('/updateEvent/:id', userAuth, updateEvent );

//export participant
eventRouter.post('/exportParticipant/:id', exportParticipant);

eventRouter.get('/getEvents',userAuth, getEvents)
eventRouter.get('/getParticularEvent/:id',userAuth, getParticularEvent);
eventRouter.get('/getPreviousEvents', userAuth, getPreviousEvents);


eventRouter.post('/fetchEmails', upload.single("emails"), fetchEmails);


export default eventRouter;