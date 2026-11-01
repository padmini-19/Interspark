import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./components/Home";
import AddTask from "./components/AddTask";
import EditTask from "./components/EditTask";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import API from "./api";

function App() {
  // Convert into a reactive state variable
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );

  // Synchronize state changes globally if localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = async () => {
    try {
      await API.post("/auth/logout");
      localStorage.removeItem("isLoggedIn");
      setIsLoggedIn(false);
      window.location.href = "/login";
    } catch (err) {
      alert("Logout failed");
    }
  };

  return (
    <BrowserRouter>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
        <div className="container">
          <Link className="navbar-brand" to="/">Task Manager</Link>
          <div>
            {isLoggedIn ? (
              <button onClick={handleLogout} className="btn btn-outline-danger btn-sm">
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-light btn-sm me-2">Login</Link>
                <Link to="/signup" className="btn btn-primary btn-sm">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="container">
        <Routes>
          {/* Public Authentication Routes */}
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/signup" element={<Signup setIsLoggedIn={setIsLoggedIn} />} />

          {/* Protected Application Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/add" element={
            <ProtectedRoute>
              <AddTask />
            </ProtectedRoute>
          } />
          <Route path="/edit/:id" element={
            <ProtectedRoute>
              <EditTask />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;