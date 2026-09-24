// Importing mongoose
const mongoose = require('mongoose');

// Defining Schema
const userSchema = new mongoose.Schema({
    email : {
        type : String,
        trim : true,
        unique : true,
        required : true
    },
    collection : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Item"
        }
    ],
    password : {
        type : String,
        trim : true,
        required : true
    }
}, {timestamps : true, suppressReservedKeysWarning : true});

// exporting model
module.exports = mongoose.model('User', userSchema);
