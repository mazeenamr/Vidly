const express = require('express');
const auth = require('../middleware/auth')
const {Customer,validate} = require('../models/customers');
const Router = express.Router();


Router.get('/',async(req,res)=>{
    const Customers = await Customer.find();
    res.send(Customers);
});

Router.get('/:id',async (req,res)=>{
    const customer = await Customer.findById(req.params.id);
  
    if(!customer) return res.status(404).send('customer Not Found !');
  
    res.send(customer);
});

Router.post('/' ,auth ,async  (req,res)=>{
    //console.log(req.body);
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    let customer = new Customer({
        name : req.body.name,
        phone : req.body.phone,
        isGold : req.body.isGold
    });
    
    customer = await customer.save();

    res.send(customer);
});

Router.put('/:id' ,auth, async(req , res) => {
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
   
    const customer =  await Customer.findByIdAndUpdate(req.params.id , {
        name :req.body.name,
        phone : req.body.phone,
        isGold : req.body.isGold
    },{new :true});
   
    if(!customer) return res.status(404).send('customer Not Found !');
    
    res.send(customer);
});

Router.delete('/:id' ,auth, async(req , res) => {
    const customer = await Customer.findByIdAndRemove(req.params.id)
    if(!customer) return res.status(404).send('customer Not Found !');
    
    res.send(customer);
});



module.exports = Router;