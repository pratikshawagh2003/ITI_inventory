import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Link,
} from "react-router-dom";
import "./App.css";
import BinCard from "./BinCard"; // Import the BinCard component

// Import images for homepage
import i1 from "./assets/i1.png";
import i2 from "./assets/i2.png";
import it3 from "./assets/it3.png";

// Import components
import Login from "./Login";
import Signup from "./Signup";
import InventoryManagement from "./InventoryManagement";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false);

  return (
    <Router>
      <Routes>
        {/* Home Page */}
        <Route path="/" element={<Home />} />

        {/* Login Page */}
        <Route path="/login" element={<Login onLogin={handleLogin} />} />

        {/* Signup Page */}
        <Route path="/signup" element={<Signup />} />

        {/* Inventory Management - Protected Route */}
        <Route
          path="/inventory"
          element={
            isLoggedIn ? (
              <InventoryManagement onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* BinCard Page */}
        <Route path="/bin-card/:id" element={<BinCard />} />

        {/* Catch-all route for invalid URLs */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

// Home Component
const Home = () => {
  return (
    <div className="homepage">
      {/* Background Images */}
      <div className="background-images">
        <img src={i1} alt="car" />
        <img src={i2} alt="dog" />
        <img src={it3} alt="cat" />
      </div>

      {/* Overlay Content */}
      <div className="overlay">
        <header className="navbar">
          <div className="logo">Industrial Training Institute, Kolhapur</div>
        </header>

        <main className="hero-section">
          <h1 className="welcome-text animated-text">
            Welcome to Inventory Management System
          </h1>
          <div className="cta-buttons">
            {/* "Get Started" Button Navigates to Login */}
            <Link to="/login">
              <button className="cta-btn">Get Started</button>
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
