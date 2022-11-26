//Order controller to handle the CREATE request

const mongoose = require('mongoose')
const asyncHandler = require('express-async-handler') 
const Profile = require('../model/profileModel')
const Orders = require('../model/orderModel')
const Cart = require('../model/cartModel')
const Items = require('../model/itemModel')

//Method get the cart items if the id is valid using findOne() method
// GET /api/placeorder
const readOrder = asyncHandler( async (req, res) => {

    //Tries to get the cart details by ID..if successful, returns the item list with quantity and price as json object
    try{
        const order = await Orders.findOne({ _id: req.body.orderid },
            { shopOwnerId: 1, uid: 1, items: 1, address: 1, deliveryCharges: 1, totalPrice: 1, status: 1, _id: 0})
        
        //Check if the order is not present, if not throw error
        if( !order )
            throw new Error('No orders yet')

        // Fetches the details from the Items collection for every item reference stored in the cart
        for(let i = 0; i < order.items.length; i++){
            try{
                const {name} = await Items.findOne({ itemid: order.items[i].itemid }, {name: 1, _id: 0})
                
                order.items[i].name = name
            }
            catch(err){
                console.log(err.message)
            }
        }

        res.status(200).send(order)
    }

    // If id is invalid, catch block throws the new error saying "Invalid ID"

    catch(err){
        res.status(204).send(err.message)
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
        //Create the order
        const order = await Orders.create(req.body)

        //Clear the Cart
        await Cart.updateOne( {uid: req.uid} , {$set: {items: []}})

        res.status(200).send('Success')
    }
    catch(err){
        throw new Error('Order Creation failed')
    }

})

module.exports = {
    readOrder,
    createOrder
}