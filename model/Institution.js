const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Institution = new Schema({
    name: {
        type: String,
        required: true,
    },
    cnpj: {
        type: String,
        required: true,
        unique: true,
    },
    area: {
        type: String
    },
    cep: {
        type: Number,
        required: true,
    },
    address: {
        type: String,
        required: true,
      },
    address_number: {
        type: Number,
        required: true,
    },
    address_complement: {
        type: String
    },
    phone_number: {
        type: Number
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    picture: {
        type: String
    },
}, {
    collection: 'institution'
});

module.exports = mongoose.model('Institution', Institution);