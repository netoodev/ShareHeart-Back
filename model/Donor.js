const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Donor = new Schema({
  name: {
    type: String,
    required: true,
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
  phone_number: {
    type: Number
  },
  cpf: {
    type: String,
    required: true,
    unique: true,
  },
  picture: {
    type: String
  },
  birth_date: {
    type: String
  }
},{
    collection: 'donor'
});

module.exports = mongoose.model('Donor', Donor);