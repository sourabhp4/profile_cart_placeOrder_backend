//Profile controller to handle the GET and PUT requests

const asyncHandler = require('express-async-handler')
const Profile = require('../model/profileModel')
const Cart = require('../model/cartModel')
const Joi = require('joi')

//Method get the profile if the id is valid using findOne() method
//GET /api/profile
const getProfile = asyncHandler( async (req, res) => {
    
    //Tries to get the profile by ID..if successful, returns the profile as json object
    try{
        const profile = await Profile.findOne({ uid: req.uid }, {username: 1, phone: 1, _id: 0})
        profile.uid = req.uid
        res.status(200).json(profile)
    }

    // If Profile is not found, catch block throws the new error saying "Profile Not Found"

    catch(err){
        res.status(400)
        throw new Error(err.message)
    }

})

//Method to update the profile
//PUT /api/profile
const updateProfile = asyncHandler( async (req, res) => {

     //Validate the profile ID..
     try{
        await Profile.findOne({ uid: req.uid})
    }

    // If Profile is not found, catch block throws the new error saying "Profile Not Found"

    catch(err){
        res.status(400)
        throw new Error('Profile Not Found, Try Again...')
    }

    //validate function used to validate the body of the request, using Joi class
    //returns the error object if validation fails
    const result = validate(req.body)

    //Handle the error object, i.e, throws a new error with the message same as the error object
    if(result){
        console.log(result)
        res.status(400)
        throw new Error(result.details[0].message)
    }
    // Updates the Profile parameters, by the parameters specified in body of the request
    const { uid, username, phone} = await Profile.findOneAndUpdate({ uid: req.uid }, req.body, { new: true })
    res.status(200).json({
        uid: uid,
        username: username,
        phone: phone
    })

})

//Method to update the profile
//POST /api/profile
const createProfile = asyncHandler( async (req, res) => {

    //Try to create a profile
    try{
        // Create the Profile with uid
        await Profile.create({
            uid: req.uid,
            phone: req.body.phone,
            username: null
        })

        await Cart.create({
            uid: req.uid,
            address: null
        })
   }

   //Catch any error while creating profile
   catch(err){
        res.status(400)
        throw new Error('Profile creation failed')
   }

   res.status(200).send('Created Successfully')

})

//Function to validate the req.body using Joi
function validate(obj){

    //Schema for the different parameters of request
    const schema = Joi.object({ 
        username: Joi.string()
        .min(3)
        .max(20)
        .required(),

        phone: Joi.string()
        .length(10)
        .pattern(/^[0-9]+$/)
        .required()
    })

    //Returns a error object if validation fails
    return schema.validate(obj).error
}


module.exports = {
    createProfile,
    getProfile,
    updateProfile
}