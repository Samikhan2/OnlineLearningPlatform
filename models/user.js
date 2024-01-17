const mongoose = require('mongoose');

// User Model
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone:{type: Number, required: true},
  role: { type: String, enum: ['student', 'teacher'], default: 'student' , required: true},
});

module.exports = mongoose.model('User', userSchema);