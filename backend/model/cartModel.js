
const mongoose = require('mongoose')

//Cart Schema
const cartSchema = mongoose.Schema({
    uid: {
        type: String
    },

    address: {
        type: String
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
