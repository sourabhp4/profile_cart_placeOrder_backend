//Transactions controller to handle the GET request

const mongoose = require('mongoose')
const asyncHandler = require('express-async-handler') 
const Profile = require('../model/profileModel')
const Orders = require('../model/orderModel')
const Item = require('../model/itemModel')

//Method get the transactions if the id is valid using find() method
// GET /api/transactions
const readTransactions = asyncHandler( async (req, res) => {

    //Tries to get the cart details by ID..if successful, returns the item list with transactions as json object
    try{
        let transactionsAll = await Orders.find({ uid: req.uid },
            { uid: 1, status: 1, totalPrice: 1, items: 1, _id: 0 })
            .sort( {createdAt: -1} )
            .skip(req.body.skip)
            .limit(req.body.limit)
        
        const transactions = []

        //Loop to access each order
        for(let j = 0; j < transactionsAll.length; j++){

            const transaction = {}
            transaction.status = transactionsAll[j].status
            transaction.totalPrice = transactionsAll[j].totalPrice
            transaction.itemNames = []

            //Loop to access each item in the order
            for(let i = 0; i < transactionsAll[j].items.length; i++){

                const { name } = await Item.findOne({itemid: transactionsAll[j].items[i].itemid})
                transaction.itemNames.push(name)
            
            }
            transactions.push(transaction)
        }
        res.status(200).json(transactions)
    }

    // If id is invalid, catch block throws the new error saying "Invalid User ID"

    catch(err){
        res.status(400)
        throw new Error(err.message)
    }

})

module.exports = {
    readTransactions
}