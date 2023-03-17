import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase-config";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";

function Login() {
  const [formLogin, setFormLogin] = React.useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  function handleInputChanges(e) {
    const inputName = e.target.name;
    const inputValue = e.target.value;

    setFormLogin((prevFormLogin) => {
      return {
        ...prevFormLogin,
        [inputName]: inputValue,
      };
    });
  }

  async function formValidation(obj) {
    // Is all input filled
    const isInputFilled = Object.values(obj).every((value) => value !== null);
    if (!isInputFilled)
      return { status: false, message: "Form is not filled!" };

    return { status: true, message: "yes" };
  }

  async function handleSubmitLogin(e) {
    e.preventDefault();
    try {
      const isFormValid = await formValidation(formLogin);
      if (!isFormValid.status) throw new Error(isFormValid.message);

      setFormLogin({ email: "", password: "" });

      await signInWithEmailAndPassword(
        auth,
        formLogin.email,
        formLogin.password
      );
      navigate("/");
    } catch (error) {
      console.log("error login ", error.message);
    }
  }

  return (
    <div className="form-container">
      <div className="form-wrapper">
        <span className="logo">Chat App</span>
        <span className="form-title">Login</span>
        <form onSubmit={handleSubmitLogin}>
          <input
            type="email"
            name="email"
            placeholder="email"
            value={formLogin.email}
            onChange={handleInputChanges}
          />
          <input
            type="password"
            name="password"
            placeholder="password"
            value={formLogin.password}
            onChange={handleInputChanges}
          />
          <button>Sign In</button>
        </form>
        <p>
          You don't have an account?{" "}
          <span className="form-switch">
            <Link to={"/Register"}>Register</Link>
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
