import mongoose from 'mongoose';
import commonSchema from './commnonFields.js';

const participantSchema = new mongoose.Schema({

    email:
        [

            {
                type: String,
                required: true
            },
           
        ],

    invitedEvent: {
        type: mongoose.Schema.Types.ObjectID,
        ref: "events",
        required: true,
    },

    ...commonSchema

})

const participantModel = mongoose.model('participants', participantSchema);

export default participantModel;