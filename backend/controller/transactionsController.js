//Transactions controller to handle the GET request

const mongoose = require('mongoose')
const asyncHandler = require('express-async-handler') 
const Profile = require('../model/profileModel')
const Orders = require('../model/orderModel')

//Method get the transactions if the id is valid using find() method
// GET /api/transactions
const readTransactions = asyncHandler( async (req, res) => {

    //Tries to get the cart details by ID..if successful, returns the item list with transactions as json object
    try{
        const transactions = await Orders.find({ uid: req.uid }, 
            { uid: 1, status: 1, totalPrice: 1, _id: 0 })
            .sort( {createdAt: -1} )
            .skip(req.body.skip)
            .limit(req.body.limit)

        res.status(200).json( transactions )
    }

    // If id is invalid, catch block throws the new error saying "Invalid User ID"

    catch(err){
        res.status(400)
        throw new Error('Invalid user ID')
    }

})

module.exports = {
    readTransactions
}