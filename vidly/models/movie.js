const Joi = require("joi");
const mongoose = require('mongoose');
const {GenreSchema} = require('./genre');

const MovieSchema = mongoose.Schema({
    title:{
        type:String,
        required:true,
        maxlength:255,
        minlength:5,
        trim:true
    },
    numberInStock : {
        type : Number,
        max : 50,
        min : 0,
        required:true
    },
    dailyRentalRate : {
        type:Number,
        max:50,
        min :0,
        required:true
    },
    genre:{
        type:GenreSchema,
        required:true
    }
});

const Movie = mongoose.model('Movie',MovieSchema);

function validateMovie (movie){
    const schema ={
        title : Joi.string().min(5).max(255).required(),
        numberInStock : Joi.number().min(0).max(50).required(),
        dailyRentalRate : Joi.number().min(0).max(50).required(),
        genreId : Joi.objectId().required()
    }
    return Joi.validate(movie , schema);
}
exports.Movie = Movie;
exports.validate = validateMovie;