import { signOut, updateProfile } from "firebase/auth";
import React from "react";
import { AuthContext } from "../App";
import { auth, db, storage } from "../firebase-config";

import { BsPersonCircle } from "react-icons/bs";
import { getDownloadURL, ref } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function Navbar() {
  //   const [downloadedPhoto, setDownloadedPhoto] = React.useState(null);
  const navigate = useNavigate();
  const { currentUser } = React.useContext(AuthContext);
  console.log("currentUser Navbar : ", currentUser);

  //   React.useEffect(() => {
  //     console.log("useEffect Navbar");
  // async function downloadAvatar() {
  //   console.log("downloadAvatar Function");
  //   if (currentUser.photoURL) {
  //     const gsReference = ref(
  //       storage,
  //       `gs://intro-chat-app-9a8c3.appspot.com/${currentUser.photoURL}`
  //     );
  //     console.log("downloadAvatar Function 2");
  //     const url = await getDownloadURL(gsReference);
  //     console.log("downloadAvatar Function 3");
  //     setDownloadedPhoto(url);
  //     console.log("downloadAvatar Function 4");
  //     await setDoc(
  //       doc(db, `users/${currentUser.uid}`),
  //       { photoURL: url },
  //       {
  //         merge: true,
  //       }
  //     );
  //     await updateProfile(auth.currentUser, {
  //       photoURL: url,
  //     });

  //     console.log("Set new photoURL");
  //   }
  // }
  // downloadAvatar();
  //   }, []);

  async function handleLogout() {
    console.log("handleLogout function");
    await signOut(auth);
    localStorage.removeItem("currentUser");
    navigate("/Login");
    // console.log(AuthContext.currentUser);
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
