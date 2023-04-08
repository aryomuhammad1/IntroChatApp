import { signOut } from "firebase/auth";
import React from "react";
import { AuthContext } from "../App";
import { auth } from "../firebase-config";

import { BsPersonCircle } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const { currentUser } = React.useContext(AuthContext);

  async function handleLogout() {
    await signOut(auth);
    localStorage.removeItem("currentUser");
    navigate("/Login");
  }
  return (
    <div className="navbar">
      <span>Intro Chat</span>
      <div className="profile">
        {currentUser.photoURL ? (
          <img src={currentUser.photoURL} alt="profile" />
        ) : (
          <BsPersonCircle />
        )}
        <span className="name">{currentUser.displayName}</span>
        <button className="logout" onClick={handleLogout}>
          logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;
