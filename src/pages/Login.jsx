import React, { useState } from "react";

const Login = ({ onLoginSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    weight: "",
    height: "",
    gender: "male",
    fitnessLevel: "beginner",
    goal: "weight_loss",
  });

  const toggleMode = () => setIsSignUp(!isSignUp);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem("fitnessUsers") || "[]");

    if (isSignUp) {
      // Sign Up
      if (!formData.name) return alert("Name is required");

      // Check if user already exists
      if (users.find(u => u.name === formData.name)) {
        return alert("User already exists! Please sign in.");
      }

      const newUser = { ...formData, joinDate: new Date().toISOString() };
      users.push(newUser);
      localStorage.setItem("fitnessUsers", JSON.stringify(users));
      localStorage.setItem("currentUser", JSON.stringify(newUser));
      onLoginSuccess(newUser);

    } else {
      // Sign In
      const existingUser = users.find(u => u.name === formData.name);
      if (!existingUser) return alert("User not registered! Please sign up first.");
      localStorage.setItem("currentUser", JSON.stringify(existingUser));
      onLoginSuccess(existingUser);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          {isSignUp ? "Sign Up" : "Sign In"}
        </h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          {isSignUp && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  name="age"
                  placeholder="Age"
                  value={formData.age}
                  onChange={handleChange}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  name="weight"
                  placeholder="Weight (kg)"
                  value={formData.weight}
                  onChange={handleChange}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  name="height"
                  placeholder="Height (cm)"
                  value={formData.height}
                  onChange={handleChange}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <select
                  name="fitnessLevel"
                  value={formData.fitnessLevel}
                  onChange={handleChange}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>

                <select
                  name="goal"
                  value={formData.goal}
                  onChange={handleChange}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="weight_loss">Weight Loss</option>
                  <option value="build_muscle">Build Muscle</option>
                  <option value="stay_fit">Stay Fit</option>
                </select>
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition"
          >
            {isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>

        <p className="text-center text-gray-500 mt-4">
          {isSignUp ? "Already have an account?" : "New here?"}{" "}
          <button
            onClick={toggleMode}
            className="text-blue-600 font-semibold hover:underline"
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
