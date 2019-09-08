const {Rental} = require('../../models/rental');
const {User} = require('../../models/user');
const {Movie} = require('../../models/movie');
const mongoose = require('mongoose');
const request = require('supertest');
const moment = require('moment');

describe('/api/returns' , ()=>{
    let server;
    let rental;
    let movie;
    let customerId;
    let movieId;
    let token;

    const exec = ()=>{
        return request(server)
            .post('/api/returns')
            .set('x-auth-token' ,token)
            .send({customerId ,movieId});
    };
    beforeEach(async ()=>{
        server = require('../../vidly');
        customerId = mongoose.Types.ObjectId();
        movieId = mongoose.Types.ObjectId();
        token = new User().generateAuthToken();

        movie = new Movie({
            _id:movieId,
            title:'12345',
            numberInStock:10,
            dailyRentalRate:2,
            genre:{name:'12345'}
        });
        await movie.save();

        rental = new Rental({
            customer : {
                _id:customerId,
                name: '12345',
                phone:'12345'
            },
            movie:{
                _id:movieId,
                title:'12345',
                dailyRentalRate:2
            }
        });
        await rental.save();
    });
    afterEach(async()=>{
        server.close();
        await Rental.remove({});
        await Movie.remove({});
    });
    it('Should return 401 if the client does not logged in' , async ()=>{
        token='';
        const res = await exec();
        expect(res.status).toBe(401);
    });
    it('Should return 400 if the customerId is not provided' , async ()=>{
        customerId = '';
        const res = await exec();
        expect(res.status).toBe(400);
    });
    it('Should return 400 if the movieId is not provided' , async ()=>{
        movieId = '';
        const res = await exec();
        expect(res.status).toBe(400);
    });
    it('Should return 404 if the rental not found' , async ()=>{
        await Rental.remove({});
        const res = await exec();
        expect(res.status).toBe(404);
    });
    it('Should return 400 if return is already processed' , async ()=>{
        rental.dateReturned = new Date();
        await rental.save();
        const res = await exec();
        expect(res.status).toBe(400);
    });
    it('Should return 200 if we have valid request' , async ()=>{
        const res = await exec();
        expect(res.status).toBe(200);
    });
    it('Should set the rentalFee if the input is valid' , async ()=>{
        rental.dateOut = moment().add(-7,'days').toDate();
        await rental.save();
        await exec();
        const rentalInDB = await Rental.findById(rental._id);
        expect(rentalInDB.rentalFee).toBe(14);
    });
    it('Should increase the movie stock if the input is valid' , async ()=>{
        await exec();
        const movieInDb = await Movie.findById(movieId);
        expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);
    });
    it('Should return the rental if the input is valid' , async ()=>{
        const res = await exec();
        const rentalInDB = await Rental.findById(rental._id);
        expect(Object.keys(res.body)).toEqual(expect.arrayContaining(['customer','movie','dateReturned','rentalFee','dateOut']));
    });
});