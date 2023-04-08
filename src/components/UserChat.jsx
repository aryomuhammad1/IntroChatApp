import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import React from "react";
import { BsPersonCircle } from "react-icons/bs";
import { AuthContext } from "../App";
import { db } from "../firebase-config";
import { SelectedUserContext } from "../pages/Home";
import { FaCamera } from "react-icons/fa";

function UserChat(props) {
  const { currentUser } = React.useContext(AuthContext);
  const { selectedUser, setSelectedUser } =
    React.useContext(SelectedUserContext);
  const { searched, setSearched } = props;

  async function handleClickUserChat(e) {
    // Ambil data userChats dari props
    const selectedUserId = e.target.closest(".user-chat").id;

    // Jika userChat baru ditambahkan dari search
    if (searched) {
      setSearched([]);
      await setDoc(
        doc(db, `userChats/${currentUser.uid}/chatInfo/${selectedUserId}`),
        {
          userInfo: {
            displayName: props.displayName,
            photoURL: props.avatar,
            ltsMsg: "",
            uid: selectedUserId,
          },
          date: serverTimestamp(),
        },
        { merge: true }
      );
    }

    if (!searched) {
      await setDoc(
        doc(db, `userChats/${currentUser.uid}/chatInfo/${selectedUserId}`),
        {
          userInfo: {
            isRead: true,
          },
        },
        { merge: true }
      );
    }
    setSelectedUser(selectedUserId);
  }

  return (
    <div
      className={`user-chat ${props.isSelected ? "selected" : ""} 
	  			${!props.isRead ? "new" : ""} `}
      onClick={handleClickUserChat}
      id={props.id}
    >
      {props.avatar ? (
        <img className="avatar" src={props.avatar} alt="avatar" />
      ) : (
        <BsPersonCircle className="avatar" />
      )}

      <div className="text">
        <div className="upper">
          <span className="name">{props.displayName}</span>
          <span className="receive-time">{props.time}</span>
        </div>
        <div className="ltsMsg">
          {props.photoIncluded && (
            <FaCamera
              style={{
                height: ".8rem",
                width: ".8rem",
                fill: "var(--spr-light-clr)",
              }}
            />
          )}

          <span className="text">{!searched && props.ltsMsg}</span>
        </div>
      </div>
    </div>
  );
}

export default UserChat;
