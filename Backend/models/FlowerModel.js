const mongoose = require('mongoose');

const flowerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    color: {
        type: String,
        required: true
    },
    image: {
        type: String, 
    }
}, { timestamps: true });

const Flower = mongoose.model('Flower', flowerSchema);
module.exports = Flower;
