import React, { useState } from "react";
import axios from "axios";
import Input from "../common/Input";
import Button from "../common/Button";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await axios.post(
        "http://127.0.0.1:8000/api/register-user",
        { username, password }
      );
      alert(result.data.message);
    } catch (error) {
      alert(error.response?.data?.message || error.message);
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
        <h1 className="text-2xl font-bold text-center text-gray-800">Register</h1>
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
            Register
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Register;
