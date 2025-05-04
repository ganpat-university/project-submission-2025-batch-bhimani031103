const asyncHandler = require('express-async-handler');
const Booking = require('../models/Booking');
const Member = require('../models/Member');
const User = require('../models/User');
const Court = require('../models/Court'); // Import the Court model
const { log } = require('../middleware/logger');
const Pricing = require('../models/Pricing');

const getDashboardStats = asyncHandler(async (req, res) => {
  if (!req.user) {
    log('UNAUTHORIZED_DASHBOARD_ACCESS_ATTEMPT_NO_USER');
    return res.status(401).json({ message: 'Not authorized, no user found' });
  }

  log(`FETCHING_DASHBOARD_STATS_${req.user.name}`);

  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();
  const totalCourts = 5;

  // Fetch court statuses
  const courts = await Court.find().sort({ number: 1 });
  const allCourts = Array.from({ length: totalCourts }, (_, i) => i + 1).map(number => {
    const existingCourt = courts.find(c => c.number === number);
    return existingCourt || { number, isActive: true };
  });

  // Get active bookings
  const activeBookings = await Booking.find({
    date: now.toISOString().split("T")[0],
    status: "confirmed"
  });

  const activeCourts = new Set();
  activeBookings.forEach((booking) => {
    const [hours, minutes] = booking.startTime.split(":").map(Number);
    const bookingStart = hours * 60 + minutes;
    const bookingEnd = bookingStart + booking.duration * 60;

    const court = allCourts.find(c => c.number === booking.court);
    if (court && court.isActive && currentTime >= bookingStart && currentTime < bookingEnd) {
      activeCourts.add(booking.court);
    }
  });

  const availableCourts = allCourts.filter(court => court.isActive).length;
  const activeMembers = await Member.countDocuments({ membershipStatus: "active" });

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const revenueData = await Booking.aggregate([
    { $match: { createdAt: { $gte: thirtyDaysAgo } } },
    { $group: { _id: null, totalRevenue: { $sum: { $multiply: ["$duration", 500] } } } }
  ]);

  const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

  const stats = {
    activeCourts: `${activeCourts.size}/${availableCourts}`,
    members: activeMembers,
    revenue: totalRevenue
  };

  log(`DASHBOARD_STATS_RETRIEVED_${req.user.name}`);
  res.status(200).json(stats);
});

const setWeekdayPricing = asyncHandler(async (req, res) => {
  if (!req.user || req.user.role !== 'admin') {
    log(`UNAUTHORIZED_PRICING_UPDATE_ATTEMPT_${req.user?.role || 'NO_ROLE'}`);
    return res.status(403).json({ message: 'Only admins can set pricing' });
  }

  const { halfHourPrice } = req.body;

  if (!halfHourPrice || halfHourPrice <= 0) {
    log(`INVALID_WEEKDAY_PRICING_ATTEMPT_${req.user.name}`);
    return res.status(400).json({ message: 'Valid half-hour price is required' });
  }

  log(`SETTING_WEEKDAY_PRICING_${halfHourPrice}_${req.user.name}`);
  
  const pricing = await Pricing.findOneAndUpdate(
    { type: 'weekday' },
    { halfHourPrice, updatedBy: req.user._id },
    { new: true, upsert: true }
  );

  res.status(200).json({
    type: 'weekday',
    halfHourPrice: pricing.halfHourPrice,
    updatedAt: pricing.updatedAt
  });
});

const setWeekendPricing = asyncHandler(async (req, res) => {
  if (!req.user || req.user.role !== 'admin') {
    log(`UNAUTHORIZED_PRICING_UPDATE_ATTEMPT_${req.user?.role || 'NO_ROLE'}`);
    return res.status(403).json({ message: 'Only admins can set pricing' });
  }

  const { halfHourPrice } = req.body;

  if (!halfHourPrice || halfHourPrice <= 0) {
    log(`INVALID_WEEKEND_PRICING_ATTEMPT_${req.user.name}`);
    return res.status(400).json({ message: 'Valid half-hour price is required' });
  }

  log(`SETTING_WEEKEND_PRICING_${halfHourPrice}_${req.user.name}`);
  
  // Update or create weekend pricing
  const pricing = await Pricing.findOneAndUpdate(
    { type: 'weekend' },
    { halfHourPrice, updatedBy: req.user._id },
    { new: true, upsert: true }
  );

  res.status(200).json({
    type: 'weekend',
    halfHourPrice: pricing.halfHourPrice,
    updatedAt: pricing.updatedAt
  });
});

const getWeekday= asyncHandler(async (req, res) => {
  log('FETCHING_WEEKDAY_PRICING');

  const pricing = await Pricing.findOne({ type: 'weekday' });

  const pricingData = {
    weekday: { halfHourPrice: pricing ? pricing.halfHourPrice : 300 } // Default price if not set
  };

  res.status(200).json(pricingData);
});

const getWeekend = asyncHandler(async (req, res) => {
  log('FETCHING_WEEKEND_PRICING');

  const pricing = await Pricing.findOne({ type: 'weekend' });

  const pricingData = {
    weekend: { halfHourPrice: pricing ? pricing.halfHourPrice : 300 } // Default price if not set
  };

  res.status(200).json(pricingData);
});

module.exports = {
  getDashboardStats,
  setWeekdayPricing,
  setWeekendPricing,
  getWeekday,
  getWeekend
};