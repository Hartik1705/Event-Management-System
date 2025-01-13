import eventModel from "../model/eventModel.js";
import participantModel from "../model/participantModel.js";


//CREATE EVENT
const createEvent = async(req,res) =>{

    try {
        const createdBy = req._id;
        // console.log("this is user's id from middleware", req._id);
        // console.log(req.body);
         const {formData, invitedPeople} = req.body;

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
    
    const userID = req._id;

    const {eventID, eventName, description, eventTime, invitedParticipants} = req.body;

    let event = await eventModel.findOne({_id : eventID, createdBy : userID});

    const participantsInEvent = await participantModel.findOne({invitedEvent : eventID}).populate("invitedEvent");

    const prev_part = participantsInEvent.email;

    let  total = prev_part.concat(invitedParticipants)

    console.log(event);


    event.eventName = eventName;
    event.description = description;
    event.eventTime = eventTime;

     participantsInEvent.email = total;


    await event.save();

    await participantsInEvent.save();

    return res.json({success : true, updatedEvent : event, participantsInEvent, prev_part});

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








export {createEvent, deleteEvent, getEvents, getParticularEvent, getPreviousEvents, updateEvent};