import React, { useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Onboarding from "./pages/Onboarding";
import Navbar from "./components/Navbar";
import { motion, AnimatePresence } from "framer-motion";

function App() {
  const [user, setUser] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState(false);

  // 🔹 Handle Firebase login success
  if (!user) {
    return (
      <Login
        onLoginSuccess={(firebaseUser) => {
          const basicUser = {
            name: firebaseUser.displayName || "User",
            email: firebaseUser.email,
            uid: firebaseUser.uid,
          };
          setUser(basicUser);
          setShowOnboarding(true);
        }}
      />
    );
  }

  // 🔹 When onboarding is done, show main app
  if (onboardingComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navbar user={user} />
        <AnimatePresence mode="wait">
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
          >
            <Dashboard user={user} />
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  // 🔹 Onboarding screen (after login)
  if (showOnboarding) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="onboarding"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.5 }}
        >
          <Onboarding
            user={user}
            onComplete={() => {
              setOnboardingComplete(true);
            }}
          />
        </motion.div>
      </AnimatePresence>
    );
  }

  return null;
}

export default App;
