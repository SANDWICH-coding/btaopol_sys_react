import React, { useState } from "react";
import axios from "axios";

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
      alert(error);
    }
  };

  return (
    <>
      <center>
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
          Username:{" "}
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />{" "}
          <br />
          <br />
          Password:{" "}
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />{" "}
          <br />
          <br />
          <input type="submit" />
        </form>
        <br />
        <br />
      </center>
    </>
  );
}

export default Register;
