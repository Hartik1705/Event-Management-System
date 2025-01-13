
const commonSchema =   {

isCreatedAt : {
        type : Date,
    },
    
    isDeleted : {
        type : Boolean,
        default : false
    },
    
    isUpdatedAt : {
        type : Date
    }
}

export default commonSchema;

