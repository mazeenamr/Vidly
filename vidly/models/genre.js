const Joi = require("joi");
const mongoose = require('mongoose');

const GenreSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
        maxlength:50,
        minlength:5
        
    }
});

const Genre = mongoose.model('Genre',GenreSchema);

function validateGenre (genre){
    const schema ={
        name : Joi.string().min(5).max(50).required()
    }
    return Joi.validate(genre , schema);
}
exports.GenreSchema=GenreSchema;
exports.Genre = Genre;
exports.validate = validateGenre;