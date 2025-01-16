import eventModel from "../model/eventModel.js";
import participantModel from "../model/participantModel.js";
import userModel from "../model/userModel.js";
import sendEventEmail from "../utils/email.js";
import csvParser from 'csv-parser';
import fs, { readdirSync } from 'fs';
import path from "path";
import { dirname } from "path";
import { createObjectCsvWriter as createCsvWriter } from 'csv-writer';


//CREATE EVENT
const createEvent = async(req,res) =>{

    try {
        const createdBy = req._id;
        // console.log("createdBy", createdBy);    
        // console.log("this is user's id from middleware", req._id);
        // console.log(req.body);

        const user = await userModel.findOne({_id : req._id});
        console.log("User",user);


         const {formData, invitedPeople} = req.body;
        console.log("invitedPeople", invitedPeople);
         const {eventName, description, eventTime} = formData;

        let invitedArr = [];

        console.log("invited people", invitedPeople);

        invitedPeople.forEach(people => {

            if(people)
            invitedArr.push(people);
        });

        const newEvent = new eventModel({
            eventName,description,eventTime,createdBy
        });

        await newEvent.save();
        
        //created new event
        // console.log(newEvent);

      
        //saving in participant model
        const participantsForEvent = new participantModel({
            email : invitedArr, invitedEvent : newEvent._id
        })

        await participantsForEvent.save();

        await sendEventEmail(invitedPeople, formData);

        // console.log(emailSent);

        // console.log("..........");
        return res.json({message : true , event : newEvent, participants : participantsForEvent});
    } 
    
    catch (error) {
        return res.json({message : false, message : error.message});
    }

}


//DELETE EVENT
const deleteEvent = async(req,res) =>{

    try{

        const {eventID} = req.body;

        const event = await eventModel.findOne({_id : eventID});
        if(!event){
            return res.json({success : false, message :"Event doesn't exist"});
        }   

        event.isDeleted = "true";
        await event.save();
        return res.json({success : true, message : "Event Deleted", event : event});

    }

    catch(error){
        return res.json({success : false, message : error.message});
    }

}


//UPDATE EVENT
const updateEvent = async(req,res) =>{
    //we need _id of user

    //we need eventID --> we get eventDetails, participants

    try{
            
    const userID = req._id;

    const {id} = req.params;
    console.log("eventId", id);
    const {eventName, description, eventTime, invitedParticipants} = req.body;

    let event = await eventModel.findOne({_id : id, createdBy : userID});
        console.log("Event...",event);
    const participantsInEvent = await participantModel.findOne({invitedEvent : id}).populate("invitedEvent");


    event.eventName = eventName || '';

    console.log("event Name....", event.eventName);
    event.description = description || '';
    event.eventTime = eventTime || '';



     participantsInEvent.email = invitedParticipants;


    await event.save();

    console.log(event);

    await participantsInEvent.save();

    const eventData = {
        eventName,
        description,
        eventTime
    }

    // console.log("This is mail");
    await sendEventEmail(invitedParticipants, eventData);

    return res.json({success : true, updatedEvent : event, participantsInEvent});
    }

    catch(error){
        return res.json({success : false, message : error.message});
    }


}


//GET EVENTS
const getEvents = async (req,res) =>{

    try{
        
        const userID = req._id;

        const events = await eventModel.find({isDeleted : "false", createdBy : userID}).populate("createdBy").sort({"createdAt" : -1});


        const eventsByCurrentUser = events.filter((e) => parseInt(e.createdBy._id) === parseInt(userID));

        console.log("ye event hai", eventsByCurrentUser);

        return res.json({success : true, events : events});

    }
    catch(error){
        return res.json({success : false, message : error.message});
    }

}


//GET PREVIOUS EVENTS
const getPreviousEvents = async(req,res) =>{
    try{

        const userID = req._id;

        const events = await eventModel.find({isDeleted : "true", createdBy : userID}).populate("createdBy").sort({"createdAt" : -1})

        const eventsByCurrentUser = events.filter((e) => parseInt(e.createdBy._id) === parseInt(userID));

        return res.json({success : true, events : eventsByCurrentUser});
    }

    catch(error){
        return res.json({success : false, message : error.message});
    }
}



//getting a particular event details
const getParticularEvent = async(req,res) =>{

    try{

        const {id} = req.params;
        // console.log("id from params", id);

        const event = await eventModel.findOne({_id : id});

        const participants = await participantModel.find({invitedEvent : id});

        let emails = [];

            participants.forEach((item) =>{
                
                item.email.forEach((e) =>{
                    emails.push(e);
                })
            })

        console.log(emails);
        if(!event){
            return res.json({success : false, message : "Error finding the event"});
        }

        return res.json({success : true , event : event, participants : emails});

    }
    catch(error){
        return res.json({success : false, message : error.message});
    }

}


//Fetching user emails from CSV file

const fetchEmails = async(req,res) =>{

    try{

        // console.log(req.file);

        const path = req.file.path;
        // console.log("path", path);

        let result = [];

        fs.createReadStream(path)
        .pipe(csvParser())
        .on("data",(data) =>{
            let emails = Object.values(data);
           emails.forEach((e) => result.push(e));

        })
        .on("end",() =>{    
     
            return res.json({success : true, emails : result });
        })
        .on("error",(err) =>{
            console.log(err);
        })

    }

    catch(error){
        return res.json({success : false, message : error.message});
    }

}



//exporting participants

const exportParticipant = async(req,res) =>{

    try{

        const {id} = req.params;

        const participants = await participantModel.findOne({invitedEvent : id}).select('email -_id');
        
        const emails = participants.email;


        //writing in file 
        const csvWriter = createCsvWriter({
            path : './uploads/participants.csv',
            header : [
                {id : 'email', title : 'Email'}
            ]
        })

        let result = [];

        emails.forEach((e) => {
            result.push({email : e})
        })

        await csvWriter.writeRecords(result);
        
        //file path
        // res.redirect('http://localhost:3000/file/participants.csv')

        // return res.json({success : true});
        // res.redirect('http://localhost:3000/file/participants.csv',);

     
        return res.json({success : true, url : 'http://localhost:3000/file/participants.csv'});

    }

    catch(error){
        return res.json({success : false, message : error.message});
    }

}





export {createEvent, deleteEvent, getEvents, getParticularEvent, getPreviousEvents, updateEvent, fetchEmails, exportParticipant};