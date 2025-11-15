import express from 'express';
import User from '../models/User.js';
import { generateToken, protect } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
  console.log('🎯 /api/auth/register endpoint hit!');

  const {
    email,
    password,
    name,
    age,
    weight,
    height,
    gender,
    fitnessLevel,
    goal,
    equipment,
    phoneNumber,
  } = req.body;

  try {
    // Validation
    if (!email || !password || !name || !age || !weight || !height || !gender || !goal) {
      return res.status(400).json({
        error: 'Please provide all required fields',
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        error: 'User with this email already exists',
      });
    }

    // Create user
    const user = await User.create({
      email,
      password,
      name,
      age,
      weight,
      height,
      gender,
      fitnessLevel: fitnessLevel || 'beginner',
      goal,
      equipment: equipment || [],
      phoneNumber: phoneNumber || null,
    });

    // Generate token
    const token = generateToken(user._id);

    console.log('✅ User registered successfully!');

    res.status(201).json({
      success: true,
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    console.error('❌ Registration Error:', error.message);
    res.status(500).json({
      error: error.message || 'Server error during registration',
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
  console.log('🎯 /api/auth/login endpoint hit!');

  const { email, password } = req.body;

  try {
    // Validation
    if (!email || !password) {
      return res.status(400).json({
        error: 'Please provide email and password',
      });
    }

    // Check if user exists (include password for comparison)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        error: 'Invalid email or password',
      });
    }

    // Check password
    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        error: 'Invalid email or password',
      });
    }

    // Generate token
    const token = generateToken(user._id);

    console.log('✅ User logged in successfully!');

    res.json({
      success: true,
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    console.error('❌ Login Error:', error.message);
    res.status(500).json({
      error: error.message || 'Server error during login',
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current logged in user
// @access  Private
router.get('/me', protect, async (req, res) => {
  console.log('🎯 /api/auth/me endpoint hit!');

  try {
    const user = req.user;

    res.json({
      success: true,
      user: user.toJSON(),
    });
  } catch (error) {
    console.error('❌ Get User Error:', error.message);
    res.status(500).json({
      error: error.message || 'Server error',
    });
  }
});

// @route   PUT /api/auth/update
// @desc    Update user profile
// @access  Private
router.put('/update', protect, async (req, res) => {
  console.log('🎯 /api/auth/update endpoint hit!');

  const {
    name,
    age,
    weight,
    height,
    gender,
    fitnessLevel,
    goal,
    equipment,
    phoneNumber,
  } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
      });
    }

    // Update fields
    if (name) user.name = name;
    if (age) user.age = age;
    if (weight) user.weight = weight;
    if (height) user.height = height;
    if (gender) user.gender = gender;
    if (fitnessLevel) user.fitnessLevel = fitnessLevel;
    if (goal) user.goal = goal;
    if (equipment) user.equipment = equipment;
    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;

    await user.save();

    console.log('✅ User profile updated successfully!');

    res.json({
      success: true,
      user: user.toJSON(),
    });
  } catch (error) {
    console.error('❌ Update Error:', error.message);
    res.status(500).json({
      error: error.message || 'Server error during update',
    });
  }
});

export default router;
