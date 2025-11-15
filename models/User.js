import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't return password by default
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    // Fitness Profile
    age: {
      type: Number,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: true,
    },
    fitnessLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    goal: {
      type: String,
      enum: ['weight_loss', 'muscle_gain', 'endurance'],
      required: true,
    },
    equipment: {
      type: [String],
      default: [],
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required for notifications'],
      match: [/^\+?[1-9]\d{1,14}$/, 'Please provide a valid phone number in E.164 format (e.g., +1234567890)'],
    },
    // Notification Preferences
    notificationSettings: {
      workoutReminder: {
        enabled: {
          type: Boolean,
          default: false,
        },
        time: {
          type: String, // Format: "HH:MM" (24-hour format)
          default: '09:00',
        },
        days: {
          type: [Number], // 0=Sunday, 1=Monday, ..., 6=Saturday
          default: [1, 2, 3, 4, 5], // Monday-Friday
        },
      },
      dailyMotivation: {
        enabled: {
          type: Boolean,
          default: false,
        },
        time: {
          type: String, // Format: "HH:MM" (24-hour format)
          default: '08:00',
        },
      },
    },
    joinDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to get user object without sensitive data
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.__v;
  return user;
};

const User = mongoose.model('User', userSchema);

export default User;
