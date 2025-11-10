import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dumbbell, Activity, Flame } from 'lucide-react';

const Workout = ({ currentWorkout, completeWorkout }) => {
  const navigate = useNavigate();

  // If the user refreshes on this page, currentWorkout will be lost.
  // This sends them back to the dashboard.
  if (!currentWorkout) {
    return (
      <div className="text-center p-10 max-w-2xl mx-auto">
         <button
          onClick={() => navigate('/')} // Go to Dashboard
          className="mb-4 text-blue-600 hover:text-blue-700 font-medium flex items-center"
        >
          ← Back to Dashboard
        </button>
        <p className="text-gray-600 mb-4">No workout selected.</p>
      </div>
    );
  }

  return (
    // Note: This page does NOT use the main <Layout>
    <div className="max-w-2xl mx-auto px-4 py-6">
      <button
        onClick={() => navigate(-1)} // Go back to the previous page
        className="mb-4 text-blue-600 hover:text-blue-700 font-medium flex items-center"
      >
        ← Back
      </button>
      <div className="bg-white rounded-2xl p-8 shadow-sm">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Dumbbell className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{currentWorkout.name}</h1>
          <div className="flex items-center justify-center space-x-6 text-gray-600">
            <span className="flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              {currentWorkout.duration} minutes
            </span>
            <span className="flex items-center">
              <Flame className="w-5 h-5 mr-2" />
              {currentWorkout.calories} calories
            </span>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <h2 className="text-xl font-semibold text-gray-800">Exercises</h2>
          {currentWorkout.exercises.map((exercise, idx) => (
            <div key={idx} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                {idx + 1}
              </div>
              <p className="text-gray-700 flex-1 pt-1">{exercise}</p>
            </div>
          ))}
        </div>

        <button
          onClick={completeWorkout}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition"
        >
          Complete Workout
        </button>
      </div>
    </div>
  );
};

export default Workout;