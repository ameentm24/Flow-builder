import { useState } from "react";
import { Input, Button, message } from "antd";
import { useNavigate, NavLink } from "react-router-dom";
import "../Styles/login.css";

const UserLogin = () => {
  const [data, setData] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const onInputChange = (e, key) => {
    setData({ ...data, [key]: e.target.value });
  };

  const loginUser = () => {
    if (!data.username || !data.password) {
      message.error("Please fill in all fields");
      return;
    }

    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const user = storedUsers.find(
      (user) =>
        user.username === data.username && user.password === data.password
    );

    if (user) {
      localStorage.setItem("userId", user.userId);
      navigate(`/user/dashboard/${user.userId}`);
      console.log("Login successful", user);
    } else {
      message.error("Invalid Username or Password");
    }
  };

  return (
    <div className="user-login border-solid border-4">
      <h1>User Login</h1>
      <label>Username</label>
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
        <Button className="btn-user mt-5" type="primary" onClick={loginUser}>
          Log In
        </Button>
      </div>
      <p>
        Don't have an account? <NavLink to="/user/signup">Sign up</NavLink>
      </p>
    </div>
  );
};

export default UserLogin;
