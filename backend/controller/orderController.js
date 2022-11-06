//Order controller to handle the CREATE request

const mongoose = require('mongoose')
const asyncHandler = require('express-async-handler') 
const Profile = require('../model/profileModel')
const Orders = require('../model/orderModel')

//Method get the cart items if the id is valid using findOne() method
// GET /api/placeorder
const readOrder = asyncHandler( async (req, res) => {

    //Tries to get the cart details by ID..if successful, returns the item list with quantity and price as json object
    try{
        const { shopOwnerId, uid, items, address, deliveryCharges, totalPrice, status } = await Orders.findOne({ uid: req.uid })
        res.status(200).json({ shopOwnerId, uid, items, address, deliveryCharges, totalPrice, status })
    }

    // If id is invalid, catch block throws the new error saying "Invalid ID"

    catch(err){
        res.status(400)
        throw new Error('Invalid User ID')
    }

})

//Method to store the transaction details
//POST /api/placeorder
const createOrder = asyncHandler( async (req, res) => {
    
    try{
       await Profile.findOne({ uid: req.uid })
    }

    catch(err){
        throw new Error('Invalid ID')
    }

    try{
        const order = await Orders.create(req.body)
        res.status(200).send(order)
    }
    catch(err){
        throw new Error('Order Creation failed')
    }

})


module.exports = {
    readOrder,
    createOrder
}