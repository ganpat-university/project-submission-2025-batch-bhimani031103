
const mongoose = require('mongoose');

const pricingSchema = new mongoose.Schema({
    type: { type: String, required: true, enum: ['weekday', 'weekend'] },
    halfHourPrice: { type: Number, required: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    updatedAt: { type: Date, default: Date.now }
  });

  module.exports = mongoose.model('Pricing', pricingSchema);