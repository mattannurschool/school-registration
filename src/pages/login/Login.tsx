import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./loginPage.css";
import { login } from "../../lib/appWrite";
import { useAuth } from "../../contexts/AuthContext";
import LoadingButton from "../../components/LoadingButton";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [formError, setFormError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const navigate = useNavigate();

  const onButtonClick = async () => {
    // Set initial error values to empty
    setFormError("");
    setEmailError("");
    setPasswordError("");

    // Check if the user has entered both fields correctly
    if ("" === email) {
      setEmailError("Please enter your email");
      return;
    }

    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setEmailError("Please enter a valid email");
      return;
    }

    if ("" === password) {
      setPasswordError("Please enter a password");
      return;
    }

    if (password.length < 7) {
      setPasswordError("The password must be 8 characters or longer");
      return;
    }
    setIsLoading(true);
    const response = await login(email, password);
    if (response) {
      navigate("/");
    } else {
      setFormError("Email or Password is Wrong");
    }
    setIsLoading(false);
  };

  return (
    <div className={"loginContainer"}>
      <div className={"titleContainer"}>
        <div>Login</div>
      </div>
      <div className="form-error errorLabel">{formError && formError}</div>
      <br />
      <div className={"inputContainer"}>
        <input
          value={email}
          placeholder="Enter your email here"
          onChange={(ev) => setEmail(ev.target.value)}
          className={"inputBox"}
        />
        <label className="errorLabel">{emailError}</label>
      </div>
      <br />
      <div className={"inputContainer"}>
        <input
          name="password"
          type="password"
          value={password}
          placeholder="Enter your password here"
          onChange={(ev) => setPassword(ev.target.value)}
          className={"inputBox"}
        />
        <label className="errorLabel">{passwordError}</label>
      </div>
      <br />
      <div className={"inputContainer"}>
        <LoadingButton
          className="btn h-[60px] justify-center"
          isLoading={isLoading}
          onClick={onButtonClick}
          title="Log in"
        />
      </div>
    </div>
  );
};

export default Login;
