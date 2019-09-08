const express = require('express');
const {Rental} = require('../models/rental');
const {Movie} = require('../models/movie');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const Router = express.Router();


Router.post('/' , [auth,validate(validateReturns)] , async (req,res) => {
    const rental = await Rental.lookup(req.body.customerId , req.body.movieId);

    if(!rental) return res.status(404).send('rental not provided');
    if(rental.dateReturned) return res.status(400).send('rental is already processed');
    
    rental.return();
    await rental.save();

    await Movie.update({_id:rental.movie._id},{
        $inc:{numberInStock:1}
    });

    res.send(rental);
});


function validateReturns (req){
    const schema ={
        customerId : Joi.objectId().required(),
        movieId : Joi.objectId().required()
    }
    return Joi.validate(req , schema);
}
module.exports=Router;