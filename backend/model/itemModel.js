
const mongoose = require('mongoose')

//Item Schema
const itemSchema = mongoose.Schema({
    itemid: {
        type: String
    },
    name: { 
        type: String,
        required: true,
        minLength: 3,
        maxLength: 20,
        unique: true
    },

    price: {
        type: Number,
        required: true
    },

    image: {
        type: String
    }

}, {
    timestamps: true
})

module.exports = mongoose.model( 'Items', itemSchema )