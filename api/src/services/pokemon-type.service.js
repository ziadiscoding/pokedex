const POKEMON_TYPES = require('../models/pokemon-type.model');

const getTypes = () => {
    return POKEMON_TYPES;
};

module.exports = {
    getTypes
};