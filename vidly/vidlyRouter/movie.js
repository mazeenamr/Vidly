const express = require('express');
const auth = require('../middleware/auth')
const {Movie , validate} = require('../models/movie');
const {Genre} = require ('../models/genre')
const Router = express.Router();




Router.get('/',async(req,res)=>{
    const movies = await Movie.find();
    res.send(movies);
});

Router.get('/:id',async (req,res)=>{
    const movie = await Movie.findById(req.params.id);
  
    if(!movie) return res.status(404).send('Movie Not Found !');
  
    res.send(movie);
});

Router.post('/' ,auth,async  (req,res)=>{
    console.log(req.body);
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    const genre = await Genre.findById(req.body.genreId);
    if(!genre) return res.status(400).send('invalid genre..');

    const movie = new Movie({
        title : req.body.title,
        numberInStock : req.body.numberInStock,
        dailyRentalRate : req.body.dailyRentalRate,
        genre : {
            _id : genre._id,
            name : genre.name
        }
    });
    
    await movie.save();

    res.send(movie);
});

Router.put('/:id' ,auth, async(req , res) => {
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
   
    const genre = await Genre.findById(req.body.genreId);
    if(!genre) return res.status(400).send('invalid genre..');

    const movie =  await Movie.findByIdAndUpdate(req.params.id ,
         {
             name :req.body.name,
             numberInStock : req.body.numberInStock,
             dailyRentalRate : req.body.dailyRentalRate,
             genre : {
                _id : genre._id,
                name : genre.name
             }
         },{new :true});
   
    if(!movie) return res.status(404).send('Movie Not Found !');
    
    res.send(movie);
});

Router.delete('/:id' ,auth, async(req , res) => {
    const movie = await Movie.findByIdAndRemove(req.params.id)
    if(!movie) return res.status(404).send('Movie Not Found !');
    
    res.send(movie);
});





module.exports = Router;
