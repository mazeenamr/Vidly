const Joi = require("joi");
const mongoose = require('mongoose');

const CustomersSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
        maxlength:50,
        minlength:5
    },
    isGold:{
        type:Boolean,
        default:false
    },
    phone:{
        type:String,
        required:true,
        maxlength:50,
        minlength:5
    }
});
const Customer = mongoose.model('Customer',CustomersSchema);

function validateCustomer (Customer){
    const schema ={
        name : Joi.string().min(5).max(50).required(),
        phone : Joi.string().min(5).max(50).required(),
        isGold : Joi.boolean()
    }
    return Joi.validate(Customer , schema);
}

exports.Customer = Customer;
exports.validate = validateCustomer;