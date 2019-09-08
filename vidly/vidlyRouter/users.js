const _ = require('lodash');
const bcrypt = require('bcrypt');
const express = require('express');
const auth = require('../middleware/auth')
const {User , validate} = require('../models/user');
const Router = express.Router();

//Getting an information about the current user
Router.get('/me' , auth , async(req,res)=>{
   
    const user = await User.findById(req.user.id).select('-password');
    res.send(user);
});

//Creating a New User (resigter a user)
Router.post('/',async(req,res)=>{
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    let user = await User.findOne({email:req.body.email});
    if (user) return res.status(400).send('User is already registered.');

    //pick method of lodash (look at the doc)
    user = new User(_.pick(req.body ,[ 'name','email','password']));
    
    // Hashing the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password,salt);
    
    await user.save(); 

    const token = user.generateAuthToken();
    res.header('x-auth-token',token).send(_.pick(user, ['_id','name','email']));
});

module.exports = Router;