const mongoose = require('mongoose')


const bookschema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    author:{
        type:String,
        required:true
    },
    publisher:{
        type:String,
        required:true
    },
    language:{
        type:String,
        required:true
    },
    noofopages:{
        type:Number,
        required:true
    },
    isbn:{
        type:String,
        required:true
    },
    imageUrl:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    dprice:{
        type:Number,
        required:true
    },
    abstract:{
        type:String,
        required:true
    },
    uploadedImages:{
        type:Array,
        required:true
    },
    userMail:{
        type:String,
        required:true
    },
    status:{
        type:String,
        default:"Pending"
    }
    ,
    BroughtBy:{
        type:String,
        default:""
    }
})


const books = mongoose.model("books", bookschema)

module.exports = books