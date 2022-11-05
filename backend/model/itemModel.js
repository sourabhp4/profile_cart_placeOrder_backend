
const mongoose = require('mongoose')
require('mongoose-type-url')

//Item Schema
const itemSchema = mongoose.Schema({
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