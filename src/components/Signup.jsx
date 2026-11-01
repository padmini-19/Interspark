import { useState } from "react";
import API from "../api";
import { useNavigate, Link } from "react-router-dom";

// Add setIsLoggedIn prop here
function Signup({ setIsLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/signup", { email, password });
      localStorage.setItem("isLoggedIn", "true");
      
      // Update state to force navbar re-render
      if (setIsLoggedIn) setIsLoggedIn(true);
      
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-4 card p-4 mt-5 shadow-sm">
        <h3 className="text-center mb-3">Sign Up</h3>
        <form onSubmit={handleSignup}>
          <div className="mb-3">
            <label>Email Address</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="btn btn-primary w-100 mb-3">Register</button>
        </form>
        <p className="text-center mb-0">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;