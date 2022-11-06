
const mongoose = require('mongoose')

//Item Schema
const cartSchema = mongoose.Schema({
    uid: {
        Type: String
    },

    address: {
        Type: String
    },

    items: [{
        itemid: {
            type : String
        },
        count: {
            type: Number
        }
    }]

}, {
    timestamps: true
})

module.exports = mongoose.model( 'Cart', cartSchema )
