// importing mongoose 
const mongoose = require('mongoose');

// defining schema
const itemSchema = new mongoose.Schema({
    id : {
        type : String,
        trim : true,
        required : true
    },
    type : {
        type : String,
        trim : true,
        enum : ['photo', 'video', 'gif', 'sticker'],
        required : true
    },
    src : {
        type : String,
        trim : true,
        required : true
    },
    thumbnail : {
        type : String,
        trim : true
    },
    title : {
        type : String,
        trim : true,
        required : true
    },
    author : {
        type : String,
        trim : true,
        required : true
    },
    meta : {
        type : String,
        required : true
    },
    format : {
        type : String,
        required : true
    }
});

// exporting it
module.exports = mongoose.model('Item', itemSchema);