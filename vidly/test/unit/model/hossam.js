const {User} = require('../../../models/user');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

/*describe('user.generateAuthToken' ,()=>{
    it('Should return a valid JWT',()=>{
        const payload = {
            _id : mongoose.Types.ObjectId().toHexString(),
            isAdmin:true
        };
        const user = new User(payload);
        const token = user.generateAuthToken();
        const decode = jwt.verify(token , config.get('jwtPrivateKey'));
        expect(decode).toMatchObject(payload);
    });
});*/