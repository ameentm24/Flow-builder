import { useState } from "react";
import { Input, Button, message } from "antd";
import { NavLink, useNavigate } from "react-router-dom";
import "../Styles/signup.css";

const UserSignup = () => {
  const [userData, setUserData] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const onInputChange = (e, key) => {
    setUserData({ ...userData, [key]: e.target.value });
  };

  const signupUser = () => {
    if (!userData.username || !userData.password) {
      message.error("Please fill in all fields");
      return;
    }

    if (userData.password.length < 8) {
      message.error("Password should be at least 8 characters long");
      return;
    }

    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const userExists = storedUsers.some(
      (user) => user.username === userData.username
    );

    if (userExists) {
      message.error("Username already exists. Please choose another.");
      return;
    }

    const newUser = {
      ...userData,
      userId: new Date().toISOString(),
    };
    storedUsers.push(newUser);

    localStorage.setItem("users", JSON.stringify(storedUsers));
    localStorage.setItem("userId", newUser.userId);
    navigate(`/user/dashboard/${newUser.userId}`);
    message.success("Signup successful!");
  };

  return (
    <div className="user-signup">
      <div className="user-signup-container">
        <h1>User Sign Up</h1>
        <label>Name</label>
        <Input
          className="user-login-input"
          onChange={(e) => onInputChange(e, "username")}
        />

        <label>Password</label>
        <Input.Password
          className="user-login-input"
          onChange={(e) => onInputChange(e, "password")}
        />

        <div className="btn-div">
          <Button className="btn-user mt-5" type="primary" onClick={signupUser}>
            Sign Up
          </Button>
        </div>
        <p>
          Already have an account? <NavLink to="/">Login</NavLink>
        </p>
      </div>
    </div>
  );
};

export default UserSignup;
