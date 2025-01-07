const mongoose = require('mongoose');

const TrainerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: true,
  },
  category: {
    type: String,
    enum: ['diet', 'rehabilitation', 'strength'],
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  shortDescription: {
    type: String,
    required: true,
  },
  detailedDescription: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Trainer = mongoose.model('Trainer', TrainerSchema);

module.exports = Trainer;