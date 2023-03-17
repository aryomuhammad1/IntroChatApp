import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import React from "react";
import { BsPersonCircle } from "react-icons/bs";
import { AuthContext } from "../App";
import { db, storage } from "../firebase-config";
import { SelectedUserContext } from "../pages/Home";
import { FaCamera } from "react-icons/fa";
// import { ChatsContext } from "./Chats";

function UserChat(props) {
  const [downloadedPhoto, setDownloadedPhoto] = React.useState(null);
  const { currentUser } = React.useContext(AuthContext);
  const { selectedUser, setSelectedUser } =
    React.useContext(SelectedUserContext);
  //   const { chats, setChats } = React.useContext(ChatsContext);
  const { searched, setSearched } = props;
  //   console.log("selectedUser : ", selectedUser);

  //   selectedUser berisi data user lengkap {displayName, photoURL, uid}

  //   React.useEffect(() => {
  // async function downloadAvatar() {
  //   if (props.avatar) {
  //     let urlDownload;
  //     const check = localStorage.getItem(`${props.avatar}`);
  //     if (check) {
  //       urlDownload = JSON.parse(check);
  //       console.log("urlDownload from local", urlDownload);
  //     } else {
  //       const gsReference = ref(
  //         storage,
  //         `gs://intro-chat-app-9a8c3.appspot.com/${props.avatar}`
  //       );
  //       urlDownload = await getDownloadURL(gsReference);
  //       console.log("urlDownload from database", urlDownload);
  //       localStorage.setItem(`${props.avatar}`, JSON.stringify(urlDownload));
  //     }
  //     setDownloadedPhoto(urlDownload);
  //   }
  // }
  // downloadAvatar();
  //   }, [props.avatar]);

  //   console.log("photoURL : ", downloadedPhoto);

  async function handleClickUserChat(e) {
    // [REVISI] AMBIL DATA DARI CHATS CONTEXT, BUKAN DARI FIRESTORE
    // [REVISI 2] AMBIL DATA LANGSUNG DARI PROPS, GAPERLU NYARI DI CHATS
    const selectedUserId = e.target.closest(".user-chat").id;
    console.log("selectedUserId : ", selectedUserId);
    // If userChat tidak ada (pertama kali klik)
    if (searched) {
      console.log("searched");
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
      console.log("isRead : true");
    }
    setSelectedUser(selectedUserId);
  }

  return (
    <div
      className={`user-chat ${props.isSelected && "selected"} ${
        !props.isRead && "new"
      } `}
      onClick={handleClickUserChat}
      id={props.id}
    >
      {props.avatar ? (
        <img className="avatar" src={props.avatar} alt="avatar" />
      ) : (
        <BsPersonCircle className="avatar" />
      )}

      <div className="text">
        <span className="name">{props.displayName}</span>
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
