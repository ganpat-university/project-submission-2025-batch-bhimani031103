const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const Plan = require('../models/Plan.js'); // Assuming a Plan model exists
const { log } = require('../middleware/logger');

// Create a new plan
const createPlan = asyncHandler(async (req, res) => {
  try {
    log('CREATING_NEW_PLAN');

    const { name, amount, hours, minutes } = req.body;

    if (!name || amount === undefined || hours === undefined || minutes === undefined) {
      log('MISSING_REQUIRED_FIELDS_PLAN');
      return res.status(400).json({ message: "Please provide all required fields: name, amount, hours, minutes" });
    }

    if (typeof amount !== 'number' || amount <= 0) {
      log('INVALID_AMOUNT');
      return res.status(400).json({ message: "Amount must be a positive number" });
    }

    if (typeof hours !== 'number' || hours < 0 || !Number.isInteger(hours)) {
      log('INVALID_HOURS');
      return res.status(400).json({ message: "Hours must be a non-negative integer" });
    }

    if (typeof minutes !== 'number' || minutes < 0 || minutes >= 60 || !Number.isInteger(minutes)) {
      log('INVALID_MINUTES');
      return res.status(400).json({ message: "Minutes must be an integer between 0 and 59" });
    }

    const duration = hours + (minutes / 60); // Convert to hours (e.g., 1 hour 30 mins = 1.5 hours)

    if (duration <= 0) {
      log('INVALID_DURATION');
      return res.status(400).json({ message: "Total duration (hours + minutes) must be greater than 0" });
    }

    const plan = await Plan.create({
      name,
      amount,
      hours,
      minutes,
      duration, // Store duration for easier booking calculations
      isActive: true, // Default to active
      createdBy: req.user.id,
    });

    log(`PLAN_CREATED_${name}`);
    res.status(201).json(plan);
  } catch (error) {
    log(`ERROR_CREATING_PLAN_${error.message}`);
    throw error;
  }
});

// Fetch all plans (optionally filter by active status)
const getPlans = asyncHandler(async (req, res) => {
  try {
    log('FETCHING_PLANS');

    const { active } = req.query; // Optional query param to filter active/inactive plans
    const query = active !== undefined ? { isActive: active === 'true' } : {};

    const plans = await Plan.find(query).sort({ createdAt: -1 });

    log(`RETRIEVED_PLANS_${plans.length}`);
    res.status(200).json(plans);
  } catch (error) {
    log(`ERROR_FETCHING_PLANS_${error.message}`);
    throw error;
  }
});

// Update a plan
const updatePlan = asyncHandler(async (req, res) => {
  try {
    log(`UPDATING_PLAN_${req.params.id}`);

    if (!req.user || !req.user.id) {
      log('UNAUTHORIZED_PLAN_UPDATE_ATTEMPT');
      res.status(401);
      throw new Error("Not authorized, user not found");
    }

    const plan = await Plan.findById(req.params.id);
    if (!plan) {
      log(`PLAN_NOT_FOUND_${req.params.id}`);
      res.status(404);
      throw new Error("Plan not found");
    }

    const { name, amount, hours, minutes, isActive } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (amount !== undefined && typeof amount === 'number' && amount > 0) {
      updateData.amount = amount;
    }
    if (hours !== undefined && typeof hours === 'number' && hours >= 0 && Number.isInteger(hours)) {
      updateData.hours = hours;
    }
    if (minutes !== undefined && typeof minutes === 'number' && minutes >= 0 && minutes < 60 && Number.isInteger(minutes)) {
      updateData.minutes = minutes;
    }
    if (isActive !== undefined && typeof isActive === 'boolean') {
      updateData.isActive = isActive;
    }

    if (hours !== undefined || minutes !== undefined) {
      const newHours = hours !== undefined ? hours : plan.hours;
      const newMinutes = minutes !== undefined ? minutes : plan.minutes;
      updateData.duration = newHours + (newMinutes / 60);
    }

    if (Object.keys(updateData).length === 0) {
      log('NO_VALID_FIELDS_TO_UPDATE');
      return res.status(400).json({ message: "No valid fields provided for update" });
    }

    const updatedPlan = await Plan.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });

    log(`PLAN_UPDATED_${req.params.id}`);
    res.status(200).json(updatedPlan);
  } catch (error) {
    log(`ERROR_UPDATING_PLAN_${error.message}`);
    throw error;
  }
});

// Delete a plan
const deletePlan = asyncHandler(async (req, res) => {
  try {
    log(`DELETING_PLAN_${req.params.id}`);

    if (!req.user || !req.user.id) {
      log('UNAUTHORIZED_PLAN_DELETION_ATTEMPT');
      res.status(401);
      throw new Error("Not authorized, user not found");
    }

    const plan = await Plan.findById(req.params.id);
    if (!plan) {
      log(`PLAN_NOT_FOUND_${req.params.id}`);
      res.status(404);
      throw new Error("Plan not found");
    }

    await plan.deleteOne();
    log(`PLAN_DELETED_${req.params.id}`);
    res.status(200).json({ message: "Plan deleted", id: req.params.id });
  } catch (error) {
    log(`ERROR_DELETING_PLAN_${error.message}`);
    throw error;
  }
});

module.exports = {
  createPlan,
  getPlans,
  updatePlan,
  deletePlan,
};