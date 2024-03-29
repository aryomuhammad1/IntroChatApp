import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db, storage } from "../firebase-config";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { BsPersonCircle } from "react-icons/bs";
import { AuthContext } from "../App";

function Register(props) {
  const [formRegis, setFormRegis] = React.useState({
    displayName: "",
    email: "",
    password: "",
  });
  const [selectedAvatar, setSelectedAvatar] = React.useState(null);

  const navigate = useNavigate();
  const { setCurrentUser } = React.useContext(AuthContext);

  async function handleInputFile(e) {
    const file = e.target.files;
    try {
      if (window.File && window.FileReader && window.FileList && window.Blob) {
        if (!file[0].type.match("image"))
          throw new Error({ message: "file is not image" });

        const picReader = new FileReader();

        picReader.addEventListener("load", (e) => {
          const picFile = e.target;
          const picObject = {
            photoURL: file[0].name,
            message: picFile.result,
          };
          setSelectedAvatar({
            ...picObject,
          });
        });

        picReader.readAsDataURL(file[0]);
        return;
      }
    } catch (error) {}
  }

  async function handleInputChanges(e) {
    try {
      const inputName = e.target.name;
      const inputValue = e.target.value;

      setFormRegis((prevFormRegis) => {
        return {
          ...prevFormRegis,
          [inputName]: inputValue,
        };
      });
    } catch (error) {}
  }

  async function formValidation(obj) {
    // 1. Is all input filled
    const isInputFilled = Object.values(obj).every((value) => value !== null);
    if (!isInputFilled)
      return { status: false, message: "Form is not filled!" };

    // 2. Is display name alredy used
    const usersSnapshot = await getDocs(
      query(
        collection(db, `users`),
        where("displayName", "==", `${obj.displayName}`)
      )
    );
    if (usersSnapshot.docs.length > 0)
      return { status: false, message: "Display name is already used!" };

    return { status: true, message: "yes" };
  }

  async function handleSubmitRegis(e) {
    e.preventDefault();
    let downloadedUrl;

    try {
      const isFormValid = await formValidation(formRegis);
      if (!isFormValid.status) {
        throw new Error(isFormValid.message);
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formRegis.email,
        formRegis.password
      );

      if (selectedAvatar) {
        const message = selectedAvatar.message;
        const storageRef = ref(storage, `${selectedAvatar.photoURL}`);
        await uploadString(storageRef, message, "data_url");

        const gsReference = ref(
          storage,
          `gs://intro-chat-app-9a8c3.appspot.com/${selectedAvatar.photoURL}`
        );
        downloadedUrl = await getDownloadURL(gsReference);
      }

      await updateProfile(userCredential.user, {
        displayName: formRegis.displayName,
        photoURL: downloadedUrl || null,
      });

      setCurrentUser(auth.currentUser);

      const userObj = {
        ...formRegis,
        photoURL: downloadedUrl || null,
      };

      await setDoc(doc(db, `users`, `${userCredential.user.uid}`), userObj);

      setFormRegis({
        displayName: "",
        email: "",
        password: "",
        photoURL: "",
      });

      navigate("/");
    } catch (error) {}
  }

  // ===JSX===
  return (
    <div className="form-container">
      <div className="form-wrapper">
        <span className="logo">Chat App</span>
        <span className="form-title">Register</span>
        <form onSubmit={handleSubmitRegis}>
          <input
            type="file"
            name="avatar"
            id="avatar"
            onChange={handleInputFile}
          />
          <div className="regis-avatar">
            {selectedAvatar ? (
              <img
                className="avatar-selected"
                src={selectedAvatar.message}
                alt="profile"
              />
            ) : (
              <BsPersonCircle className="avatar-selected" />
            )}

            <label className="label-upload" htmlFor="avatar">
              <span>Change your avatar</span>
            </label>
          </div>
          <input
            type="text"
            name="displayName"
            placeholder="display name"
            value={formRegis.displayName}
            onChange={handleInputChanges}
          />
          <input
            type="email"
            name="email"
            placeholder="email"
            value={formRegis.email}
            onChange={handleInputChanges}
          />
          <input
            type="password"
            name="password"
            placeholder="password"
            value={formRegis.password}
            onChange={handleInputChanges}
          />

          <button>Sign In</button>
        </form>
        <p>
          You do have an account?{" "}
          <span className="form-switch">
            <Link to={"/Login"}>Login</Link>
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;
