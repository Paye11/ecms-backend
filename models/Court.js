// models/Court.js
const mongoose = require('mongoose');

const courtSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  location: { type: String, required: true, trim: true },
  passwordHash: { type: String, required: true, select: false }
});

module.exports = mongoose.model('Court', courtSchema);
