import mongoose from 'mongoose';

const workoutSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['cardio', 'strength', 'mixed'],
      required: true,
    },
    duration: {
      type: Number,
      required: true, // in minutes
    },
    calories: {
      type: Number,
      required: true,
    },
    exercises: {
      type: [String],
      default: [],
    },
    completed: {
      type: Boolean,
      default: true,
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying by user and date
workoutSchema.index({ userId: 1, completedAt: -1 });

const Workout = mongoose.model('Workout', workoutSchema);

export default Workout;
