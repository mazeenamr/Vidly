const express = require('express');
const validateObjectId = require('../middleware/validateObjectId');
const auth = require('../middleware/auth')
const Admin = require('../middleware/admin')
const mongoose = require('mongoose');
const {Genre , validate} = require('../models/genre');
const Router = express.Router();


Router.get('/',async(req,res)=>{
    //throw new Error('could not get the genres');
    const genres = await Genre.find();
    res.send(genres);
});

Router.get('/:id',validateObjectId,async (req,res)=>{
    const genre = await Genre.findById(req.params.id);
    if(!genre) return res.status(404).send('Genre Not Found !');
    res.send(genre);
});

    Router.post('/' , auth ,async(req,res)=>{

        const {error} = validate(req.body);
        if(error) return res.status(400).send(error.details[0].message);
        
        let genre = new Genre({name : req.body.name});
        
        genre = await genre.save();

        res.send(genre);
    });

Router.put('/:id' ,auth, async(req , res) => {
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
   
    const genre =  await Genre.findByIdAndUpdate(req.params.id , {name :req.body.name},{new :true});
   
    if(!genre) return res.status(404).send('Genre Not Found !');
    
    res.send(genre);
});

Router.delete('/:id' ,[auth,Admin], async(req , res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id)
    if(!genre) return res.status(404).send('Genre Not Found !');
    
    res.send(genre);
});
module.exports = Router;