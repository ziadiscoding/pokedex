const mongoose = require('mongoose');

const regionSchema = new mongoose.Schema({
    regionName: {
        type: String,
        required: true
    },
    regionPokedexNumber: {
        type: Number,
        required: true
    }
}, { _id: false });

const pokemonSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    types: {
        type: [{
            type: String,
            enum: require('./pokemon-type.model'),
            required: true
        }],
        validate: {
            validator: function (types) {
                return types.length >= 1 && types.length <= 2;
            },
            message: 'A Pokemon must have 1 or 2 types'
        }
    },
    description: {
        type: String,
        required: true
    },
    imgUrl: {
        type: String,
        required: true
    },
    soundPath: {
        type: String,
        default: null
    },
    height: {
        type: Number,
        min: 0,
        validate: {
            validator: function(value) {
                return value >= 0;
            },
            message: 'Height must be a positive number'
        }
    },
    weight: {
        type: Number,
        min: 0,
        validate: {
            validator: function(value) {
                return value >= 0;
            },
            message: 'Weight must be a positive number'
        }
    },
    regions: [regionSchema]
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

pokemonSchema.index({ name: 'text' });

module.exports = mongoose.model('Pokemon', pokemonSchema);