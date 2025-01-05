const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    points: { type: Number, default: 0 },
    age: {type:Number, default: 24},
    level: {
      type: String,
      enum: ['Bronze', 'Silver', 'Gold'],
      default: 'Bronze',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);