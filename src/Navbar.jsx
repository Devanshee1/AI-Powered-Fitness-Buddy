import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";

const Navbar = ({ user }) => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.reload(); // reloads app → back to login
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <nav className="bg-white shadow-md px-6 py-3 flex justify-between items-center">
      <h1 className="text-xl font-bold text-indigo-600">AI Fitness Buddy</h1>

      <div className="flex items-center space-x-4">
        <span className="text-gray-700 font-medium">
          {user?.name || "User"}
        </span>
        <button
          onClick={handleLogout}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
