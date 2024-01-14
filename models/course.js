const mongoose = require('mongoose')

// Course Model
const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  duration: { type: Number }, // You might have more specific details
});

module.exports = mongoose.model('Course', courseSchema);