import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import React from "react";
import { BsPaperclip } from "react-icons/bs";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";
import { AuthContext } from "../App";
import { db, storage } from "../firebase-config";
import { SelectedUserContext } from "../pages/Home";
import { SelectedChatContext } from "./Chat";

function InputMessage({ attachedPicture, setAttachedPicture }) {
  const { selectedChat, setSelectedChat } =
    React.useContext(SelectedChatContext);
  const { currentUser } = React.useContext(AuthContext);
  const { selectedUser } = React.useContext(SelectedUserContext);

  async function handleAttachFile(e) {
    // Masukkan algoritma pilih gambar dari aplikasi bengkel online
    const file = e.target.files;
    console.log("upload picture, file : ", file);
    try {
      if (window.File && window.FileReader && window.FileList && window.Blob) {
        console.log(file[0].type.match("image"));
        if (!file[0].type.match("image"))
          throw new Error({ message: "file is not image" });

        const picReader = new FileReader();

        picReader.addEventListener("load", (e) => {
          const picFile = e.target;
          console.log("picFile : ", picFile);
          const picObject = {
            photoURL: file[0].name,
            message: picFile.result,
          };
          console.log("picObjet : ", picObject);

          setAttachedPicture(picObject);
        });
        picReader.readAsDataURL(file[0]);
        return;
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  async function handleSubmitMessage(e) {
    e.preventDefault();

    let downloadedUrl;

    if (attachedPicture.message) {
      // 1. Upload foto ke storage
      const message = attachedPicture.message;
      const storageRef = ref(storage, `${attachedPicture.photoURL}`);
      await uploadString(storageRef, message, "data_url");

      const gsReference = ref(
        storage,
        `gs://intro-chat-app-9a8c3.appspot.com/${attachedPicture.photoURL}`
      );
      downloadedUrl = await getDownloadURL(gsReference);
      // 2. Save text dan downloadedUrl ke firestore
      //   3. Kosongkan attachedPicture
      setAttachedPicture({});
    }

    const newMessage = e.target.message.value;

    let messageObj;

    // if(attachedFile){
    // 	messageObj = {
    // 		message:
    // 	}

    // }

    let time = new Date();
    let hours = time.getHours();
    let minutes = `${time.getMinutes()}`;
    time = `${hours}.${minutes.length === 1 ? "0" : ""}${minutes}`;

    messageObj = {
      message: newMessage,
      userId: currentUser.uid,
      time: time,
      photoURL: downloadedUrl || null,
    };

    console.log("messageObj from input : ", messageObj);

    if (selectedChat.chatId) {
      //   console.log("selectedChat is not null ");
      setSelectedChat((prevSelectedChat) => {
        return {
          ...prevSelectedChat,
          messages: [...prevSelectedChat.messages, messageObj],
        };
        // }
      });
      e.target.message.value = "";
      await setDoc(
        doc(db, `chats/${selectedChat.chatId}`),
        { messages: arrayUnion(messageObj) },
        { merge: true }
      );
    }

    if (!selectedChat.chatId) {
      //   console.log("selectedChat is null ");

      const userDoc = await getDoc(doc(db, `users`, `${selectedUser}`));
      const userData = userDoc.data();
      const chatId = Math.random().toString(20).substring(2, 20);

      setSelectedChat({
        chatId: chatId,
        userData: userData,
        messages: [messageObj],
      });

      e.target.message.value = "";

      await setDoc(doc(db, `chats`, `${chatId}`), {
        messages: [messageObj],
        usersId: { [currentUser.uid]: true, [selectedUser]: true },
      });

      //   Create the whole new userChat for the receiver for the first time
      await setDoc(
        doc(db, `userChats/${selectedUser}/chatInfo/${currentUser.uid}`),
        {
          userInfo: {
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
            ltsMsg: newMessage,
            photoIncluded: downloadedUrl ? true : false,
            isRead: false,
            time: time,
            uid: currentUser.uid,
          },
          date: serverTimestamp(),
        }
      );
    }

    // Save ltsMsg
    await setDoc(
      doc(db, `userChats`, `${currentUser.uid}`, `chatInfo`, `${selectedUser}`),
      {
        date: serverTimestamp(),
        userInfo: {
          ltsMsg: newMessage,
          photoIncluded: downloadedUrl ? true : false,
          isRead: true,
          time: time,
        },
      },
      { merge: true }
    );
    await setDoc(
      doc(db, `userChats`, `${selectedUser}`, `chatInfo`, `${currentUser.uid}`),
      {
        date: serverTimestamp(),
        userInfo: {
          ltsMsg: newMessage,
          photoIncluded: downloadedUrl ? true : false,
          isRead: false,
          time: time,
        },
      },
      { merge: true }
    );

    console.log("setDoc New Message success!");
  }

  console.log("attachedPicture from inputMessage : ", attachedPicture);
  return (
    <div className="input-message">
      <form onSubmit={handleSubmitMessage}>
        <input
          type="text"
          name="message"
          placeholder="Type something..."
          autoComplete="off"
        />
        {!attachedPicture.message && (
          <React.Fragment>
            <input
              type="file"
              name="attachedFile"
              id="attachedFile"
              onChange={handleAttachFile}
            />
            <label className="attachedFile" htmlFor="attachedFile">
              <BsPaperclip
                style={{
                  height: "1.6rem",
                  width: "1.6rem",
                  marginRight: ".8rem",
                  fill: "var(--font-gray)",
                  cursor: "pointer",
                }}
              />
            </label>
          </React.Fragment>
        )}

        {/* <input type="file" name="attach-picture" id="attach-picture" />
        <label className="attach-picture" htmlFor="attach-picture">
          <MdOutlineAddPhotoAlternate
            style={{
              height: "1.6rem",
              width: "1.6rem",
              marginRight: ".8rem",
              fill: "var(--font-gray)",
              cursor: "pointer",
            }}
          />
        </label> */}
        <button>Send</button>
      </form>
    </div>
  );
}

export default InputMessage;
