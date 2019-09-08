const Joi = require("joi");
const mongoose = require('mongoose');
const config = require('config');
const jwt = require('jsonwebtoken');


const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        maxlength:50,
        minlength:5
        
    },
    email:{
        type:String,
        unique:true,
        required:true,
        maxlength:255,
        minlength:5
    },
    password:{
        type:String,
        required:true,
        maxlength:1024,
        minlength:5
    },
    isAdmin : Boolean
});
userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({id : this._id , isAdmin : this.isAdmin} , config.get("jwtPrivateKey"));
    return token;
}

const User = mongoose.model('User',userSchema);

function validateUser (user){
    const schema ={
        name : Joi.string().min(5).max(50).required(),
        email: Joi.string().email().min(5).max(255).required(),
        password : Joi.string().min(5).max(255).required()
    }
    return Joi.validate(user , schema);
}
exports.User = User;
exports.validate = validateUser;