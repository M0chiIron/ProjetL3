import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/login", { email, password });
      if (response.data.success) {
        setMessage("Login successful!");
        setTimeout(() => {
          navigate("/library");
        }, 2000);
      } else {
        setMessage("Invalid credentials");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setMessage("An error occurred during login");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/register", { email, password });
      if (response.data.success) {
        setMessage("Registration successful!");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        setMessage("Registration failed");
      }
    } catch (error) {
      console.error("Error registering:", error);
      setMessage("An error occurred during registration");
    }
  };

  return (
    <div className="login-page">
      {message && <p className="message">{message}</p>}
      {isRegistering ? (
        <form onSubmit={handleRegister} className="login-form">
          <h2>Register</h2>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <button type="submit">Register</button>
          <p onClick={() => setIsRegistering(false)}>Already have an account? Login</p>
        </form>
      ) : (
        <form onSubmit={handleLogin} className="login-form">
          <h2>Login</h2>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <button type="submit">Login</button>
          <p onClick={() => setIsRegistering(true)}>Don't have an account? Register</p>
        </form>
      )}
    </div>
  );
};

export default LoginPage;