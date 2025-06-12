import React, { useState } from "react";
import axiosInstance from "../../axiosInstance";
import { useNavigate } from "react-router-dom";
import Button from "../common/Button";
import Input from "../common/Input";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const existingToken = localStorage.getItem("token");

    if (existingToken) {
      alert("Already logged in. Please log out first.");
      return;
    }

    try {
      const res = await axiosInstance.post("/login", {
        username,
        password,
      });

      const token = res.data.token;

      localStorage.setItem("token", token);
      console.log("Login successful!", token);
      navigate("/school");
    } catch (err) {
      console.error(
        "Login failed:",
        err.response?.data?.message || err.message
      );
      alert(
        "Login failed: " + (err.response?.data?.message || "Unknown error")
      );
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-sm space-y-6 rounded-xl bg-white p-8 shadow-lg">
        {/* Logo at the top center */}
        <div className="flex justify-center mb-4">
          <img
            src="/default-logo.jpg"
            alt="Logo"
            className="h-20 w-auto"
          />
        </div>
        <h1 className="text-2xl font-bold text-center text-gray-800">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" variant="primary" className="w-full">
            Login
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Login;
