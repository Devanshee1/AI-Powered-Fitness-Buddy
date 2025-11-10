import React, { useState, useEffect } from "react";
import {
  User,
  Award,
  Flame,
  Target,
  BarChart3,
  Edit2,
  CheckCircle,
  XCircle,
} from "lucide-react";

const ProfilePage = ({ workoutHistory = [], todaySteps = 0 }) => {
  // Load user from localStorage or use default values
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser
      ? JSON.parse(storedUser)
      : {
          name: "Devanshee",
          age: 21,
          weight: 70,
          height: 170,
          fitnessLevel: "intermediate",
          goal: "build_muscle",
          joinDate: "2024-01-10",
        };
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);

  useEffect(() => {
    setEditedUser(user);
  }, [user]);

  const handleSave = () => {
    setUser(editedUser);
    localStorage.setItem("user", JSON.stringify(editedUser));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({ ...editedUser, [name]: value });
  };

  const formatText = (text = "") =>
    text.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  const totalWorkouts = workoutHistory.length;
  const totalCalories = workoutHistory.reduce((sum, w) => sum + w.calories, 0);

  const fitnessLevels = ["beginner", "intermediate", "advanced"];
  const goals = ["weight_loss", "build_muscle", "stay_fit"];

  if (!user) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="flex items-center space-x-4 p-6 bg-white rounded-2xl shadow-sm">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
          <User className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
          <p className="text-gray-500">
            Joined: {new Date(user.joinDate).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Key Stats */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-blue-500" />
          Lifetime Stats
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-blue-50 rounded-lg">
            <Award className="w-6 h-6 mx-auto text-blue-600 mb-1" />
            <p className="text-xl font-bold text-gray-800">{totalWorkouts}</p>
            <p className="text-sm text-gray-500">Workouts</p>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg">
            <Flame className="w-6 h-6 mx-auto text-orange-600 mb-1" />
            <p className="text-xl font-bold text-gray-800">
              {totalCalories.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500">Calories</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg col-span-2 md:col-span-1">
            <Target className="w-6 h-6 mx-auto text-green-600 mb-1" />
            <p className="text-xl font-bold text-gray-800">
              {todaySteps.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500">Today's Steps</p>
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800 flex items-center">
            <User className="w-5 h-5 mr-2 text-blue-500" />
            Your Details
          </h2>

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="text-blue-600 hover:text-blue-800 flex items-center"
            >
              <Edit2 className="w-4 h-4 mr-1" /> Edit
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                className="text-green-600 hover:text-green-800 flex items-center"
              >
                <CheckCircle className="w-4 h-4 mr-1" /> Save
              </button>
              <button
                onClick={handleCancel}
                className="text-red-600 hover:text-red-800 flex items-center"
              >
                <XCircle className="w-4 h-4 mr-1" /> Cancel
              </button>
            </div>
          )}
        </div>

        <ul className="space-y-3">
          {/* Age */}
          <li className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-gray-500">Age</span>
            {isEditing ? (
              <input
                type="number"
                name="age"
                value={editedUser.age}
                onChange={handleChange}
                className="border rounded-lg p-1 text-sm text-gray-800 w-28 text-right focus:outline-none focus:ring focus:ring-blue-100"
              />
            ) : (
              <span className="font-medium text-gray-800">{user.age}</span>
            )}
          </li>

          {/* Weight */}
          <li className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-gray-500">Weight</span>
            {isEditing ? (
              <input
                type="number"
                name="weight"
                value={editedUser.weight}
                onChange={handleChange}
                className="border rounded-lg p-1 text-sm text-gray-800 w-28 text-right focus:outline-none focus:ring focus:ring-blue-100"
              />
            ) : (
              <span className="font-medium text-gray-800">{user.weight} kg</span>
            )}
          </li>

          {/* Height */}
          <li className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-gray-500">Height</span>
            {isEditing ? (
              <input
                type="number"
                name="height"
                value={editedUser.height}
                onChange={handleChange}
                className="border rounded-lg p-1 text-sm text-gray-800 w-28 text-right focus:outline-none focus:ring focus:ring-blue-100"
              />
            ) : (
              <span className="font-medium text-gray-800">{user.height} cm</span>
            )}
          </li>

          {/* Fitness Level */}
          <li className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-gray-500">Fitness Level</span>
            {isEditing ? (
              <select
                name="fitnessLevel"
                value={editedUser.fitnessLevel}
                onChange={handleChange}
                className="border rounded-lg p-1 text-sm text-gray-800 w-32 text-right focus:outline-none focus:ring focus:ring-blue-100"
              >
                {fitnessLevels.map((level) => (
                  <option key={level} value={level}>
                    {formatText(level)}
                  </option>
                ))}
              </select>
            ) : (
              <span className="font-medium text-gray-800 capitalize">
                {formatText(user.fitnessLevel)}
              </span>
            )}
          </li>

          {/* Main Goal */}
          <li className="flex items-center justify-between py-2">
            <span className="text-gray-500">Main Goal</span>
            {isEditing ? (
              <select
                name="goal"
                value={editedUser.goal}
                onChange={handleChange}
                className="border rounded-lg p-1 text-sm text-gray-800 w-40 text-right focus:outline-none focus:ring focus:ring-blue-100"
              >
                {goals.map((goal) => (
                  <option key={goal} value={goal}>
                    {formatText(goal)}
                  </option>
                ))}
              </select>
            ) : (
              <span className="font-medium text-gray-800">
                {formatText(user.goal)}
              </span>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ProfilePage;
