// src/pages/OnboardingPage.jsx
import React, { useState, useEffect } from "react";

const OnboardingPage = ({ currentUser, onComplete }) => {
  const [userData, setUserData] = useState({
    name: currentUser.name || "",
    age: currentUser.age || "",
    weight: currentUser.weight || "",
    height: currentUser.height || "",
    fitnessLevel: "medium",
    goal: "stay_fit",
    workoutType: "balanced", // options: weight_loss, build_muscle, stay_fit
  });

  const fitnessLevels = ["easy", "medium", "hard"];
  const goals = ["weight_loss", "build_muscle", "stay_fit"];
  const workoutTypes = ["weight_loss", "build_muscle", "stay_fit"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save user uniquely in localStorage using name (or email if available)
    const userKey = `user_${userData.name}`;
    localStorage.setItem(userKey, JSON.stringify({ ...userData, joinDate: new Date().toISOString() }));
    localStorage.setItem("currentUserKey", userKey); // store currently logged in user
    onComplete(userData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Complete Your Profile
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={userData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              name="age"
              placeholder="Age"
              value={userData.age}
              onChange={handleChange}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="number"
              name="weight"
              placeholder="Weight (kg)"
              value={userData.weight}
              onChange={handleChange}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              name="height"
              placeholder="Height (cm)"
              value={userData.height}
              onChange={handleChange}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <select
              name="fitnessLevel"
              value={userData.fitnessLevel}
              onChange={handleChange}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {fitnessLevels.map((level) => (
                <option key={level} value={level}>{level.charAt(0).toUpperCase() + level.slice(1)}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <select
              name="goal"
              value={userData.goal}
              onChange={handleChange}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {goals.map((goal) => (
                <option key={goal} value={goal}>{goal.replace("_", " ").toUpperCase()}</option>
              ))}
            </select>

            <select
              name="workoutType"
              value={userData.workoutType}
              onChange={handleChange}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {workoutTypes.map((type) => (
                <option key={type} value={type}>{type.replace("_", " ").toUpperCase()}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition"
          >
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default OnboardingPage;
