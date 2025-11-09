import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar } from 'lucide-react';

// This component only needs the workoutHistory to display
const Progress = ({ workoutHistory }) => {

  // This helper function was on the dashboard, let's move it here
  const getWeeklyData = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    // Just using random data as before
    return days.map((day, i) => ({
      day,
      steps: Math.floor(Math.random() * 8000) + 4000,
      calories: Math.floor(Math.random() * 400) + 200
    }));
  };
  
  const weeklyData = getWeeklyData();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Your Progress</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Weekly Steps</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip />
              <Bar dataKey="steps" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Calories Burned</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip />
              <Line type="monotone" dataKey="calories" stroke="#f97316" strokeWidth={3} dot={{ fill: '#f97316', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {workoutHistory.length > 0 ? (
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-blue-500" />
            Full Workout History
          </h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {workoutHistory.map((workout, idx) => (
              <div key={idx} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-medium text-gray-800">{workout.name}</p>
                  <p className="text-sm text-gray-500">{new Date(workout.date).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-800">{workout.duration} min</p>
                  <p className="text-xs text-orange-600">{workout.calories} cal</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center p-10 bg-white rounded-2xl shadow-sm">
          <p className="text-gray-500">You haven't completed any workouts yet. Go start one!</p>
        </div>
      )}
    </div>
  );
};

export default Progress;