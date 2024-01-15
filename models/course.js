const mongoose = require('mongoose')

// Course Model
const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: {type: String, required: true },
  description: { type: String, required: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  duration: { type: Number },
});

module.exports = mongoose.model('Course', courseSchema);