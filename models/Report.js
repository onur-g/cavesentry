const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    diverName: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    advice: {
        type: String,
        required: true
    },
    dangerLevel: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Report', reportSchema);
