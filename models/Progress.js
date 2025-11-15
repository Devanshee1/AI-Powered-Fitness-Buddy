import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    steps: {
      type: Number,
      default: 0,
    },
    caloriesBurned: {
      type: Number,
      default: 0,
    },
    weight: {
      type: Number, // Track weight changes over time
    },
    workoutsCompleted: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient querying by user and date
progressSchema.index({ userId: 1, date: -1 });

// Ensure one progress entry per user per day
progressSchema.index({ userId: 1, date: 1 }, { unique: true });

const Progress = mongoose.model('Progress', progressSchema);

export default Progress;
