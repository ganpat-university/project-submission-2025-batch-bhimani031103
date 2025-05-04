const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  hours: { type: Number, required: true },
  minutes: { type: Number, required: true },
  duration: { type: Number, required: true }, 
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Plan', planSchema);