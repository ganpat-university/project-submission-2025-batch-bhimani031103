const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const prompt = require('prompt-sync')({ sigint: true });
const User = require('../models/User'); // Adjust path to your User model

const createAdminUser = async (userData) => {
  try {
    const { name, email, password, phoneNumber, gender, dateOfBirth } = userData;

    // Validate required fields
    if (!name || !email || !password || !phoneNumber || !gender || !dateOfBirth) {
      throw new Error('All fields are required');
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new admin user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      gender,
      dateOfBirth: new Date(dateOfBirth), // Ensure date is parsed correctly
      role: 'admin', // Set role to admin
      isVerified: true, // Automatically verified
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Save user to database
    await user.save();
    console.log('Admin user created successfully:', user.email);
    return user;

  } catch (error) {
    console.error('Error creating admin user:', error.message);
    throw error;
  }
};

// Function to prompt user for input
const getUserInput = () => {
  console.log('Enter user details:');
  const name = prompt('Name: ');
  const email = prompt('Email: ');
  const password = prompt('Password: ', { echo: '*' }); // Hide password input
  const phoneNumber = prompt('Phone Number: ');
  const gender = prompt('Gender (male/female/other): ');
  const dateOfBirth = prompt('Date of Birth (YYYY-MM-DD): ');

  return {
    name,
    email,
    password,
    phoneNumber,
    gender,
    dateOfBirth,
  };
};

// Connect to MongoDB and run the script
(async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/fnr', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
    
    const userData = getUserInput();
    await createAdminUser(userData);
    console.log('Script completed successfully');
    mongoose.connection.close();
  } catch (error) {
    console.error('Script execution failed:', error.message);
    mongoose.connection.close();
  }
})();