const mongoose = require('mongoose');

const trainerSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    imgUrl: {
        type: String,
        required: true
    },
    trainerName: {
        type: String,
        required: true,
        trim: true
    },
    creationDate: {
        type: Date,
        default: Date.now
    },
    pkmnSeen: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pokemon'
    }],
    pkmnCatch: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pokemon'
    }]
});

module.exports = mongoose.model('Trainer', trainerSchema);