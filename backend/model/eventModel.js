import mongoose from 'mongoose';
import commonSchema from './commnonFields.js';

const eventSchema = new mongoose.Schema({

    eventName: {
        type: String,
        required: true,
    },

    description: {
        type: String,
        required: true,
    },

    eventTime: {
        type: Date,
        required: true
    },

    createdBy : {
        type : mongoose.Schema.Types.ObjectID,
        ref : 'users',
        required : true
    },

    // invitedPeople : [

    //     {
    //         type : String,
    //         required : true
    //     }

    // ],

    ...commonSchema




}, {timestamps : true});


const eventModel = new mongoose.model('events', eventSchema);

export default eventModel;
