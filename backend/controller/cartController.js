//Cart controller to handle the GET, DELETE and PUT requests

const mongoose = require('mongoose')
const asyncHandler = require('express-async-handler') 
const Profile = require('../model/profileModel')
const Items = require('../model/itemModel')
const Cart = require('../model/cartModel')

//Method get the cart items if the id is valid using findOne() method
// GET /api/cart/:id
const getCart = asyncHandler( async (req, res) => {

    //Tries to get the cart details by ID..if successful, returns the cart array as json object
    try{
        await Profile.findOne({ uid: req.uid })
    }

    // If id is invalid, catch block throws the new error saying "Invalid ID"

    catch(err){
        res.status(400)
        throw new Error('Invalid ID')
    }

    getItems(req, res)
})

//Method to update the cart
//PUT /api/cart/:id
const putItem = asyncHandler( async (req, res) => {
    
    //Validate the user ID..
     try{
        await Profile.findOne({ uid: req.uid })
    }

    // If ID not found, catch block throws the new error saying "Invalid ID"
    catch(err){
        res.status(400)
        throw new Error('Invalid ID')
    }

    //Check for required parameters
    if(!req.body.itemid || !req.body.count)
        throw new Error('Provide required parameters')

    //If the count == 0 then delete that item from the cart
    if(req.body.count == 0)
        deleteItem(req, res)

    //If the count is not zero
    else{
        // Updates the Cart Item count, by the count specified in body of the request
        try{

            await Cart.updateOne( { uid: req.uid, "items.itemid": req.body.itemid }, 
                {$set: {"items.$.count": req.body.count}})

            //Get the updated items in the cart
            getItems(req, res)

        }

        //If Item count can't be updated, throws an error
        catch(err){
            res.status(400)
            throw new Error('Item ID is invalid')
        }
    }

})

//Method to delete item from the cart if count == 0
async function deleteItem (req, res) {

   // Deletes the item from the item list of the cart
   try{
        const { itemid } = req.body
        await Cart.updateOne({ uid: req.uid}, { $pull: {items: { itemid }}})
        
        //Get the updated items in the cart
        getItems(req, res)
   }

   //Throws an Error if item ID is invalid
   catch(err){
    res.status(400)
    throw new Error('Item ID is invalid')
   }

}

// Function to get the details of the items from the database
async function getItems(req, res){

    //Get the parameters from the Cart collection
    const { address, items } = await Cart.findOne({ uid: req.uid })

    // Fetches the details from the Items collection for every item reference stored in the cart 
    const cartItems = []
    for(let i = 0; i < items.length; i++){
        
            const { name, price } = await Items.findOne({ itemid: items[i].itemid })

            const count = items[i].count
            const itemid = items[i].itemid
            cartItems.push({ itemid, name, price, count})
        
    }

    //Returns the User ID with the cartItems
    res.status(200).json({
        uid: req.uid,
        address: address,
        cart: cartItems
    }) 
}

module.exports = {
    getCart,
    putItem
}