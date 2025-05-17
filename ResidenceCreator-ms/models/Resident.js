const { Schema, model } = require('mongoose');

const ResidentSchema = new Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  fullName: String,
  email: String,
  registeredAt: { type: Date, default: Date.now }
});

module.exports = model('Resident', ResidentSchema);