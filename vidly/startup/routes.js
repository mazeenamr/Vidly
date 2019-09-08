const genres = require('../vidlyRouter/genre');
const customers = require('../vidlyRouter/customers');
const movies = require('../vidlyRouter/movie');
const rental = require('../vidlyRouter/rental');
const user = require('../vidlyRouter/users');
const auth = require('../vidlyRouter/auth');
const error = require('../middleware/error');
const returns = require('../vidlyRouter/returns');
const express = require ('express');

module.exports = function(app){
    app.use(express.json());
    app.use(express.urlencoded({extended:true}));
    app.use('/api/genres' , genres);
    app.use('/api/customers',customers);
    app.use('/api/movies',movies);
    app.use('/api/rentals',rental);
    app.use('/api/users' , user);
    app.use('/api/auth' , auth);
    app.use('/api/returns',returns);
    app.use(error);
}