import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import React from "react";
import { BsFillCameraVideoFill } from "react-icons/bs";
import { BsFillPersonPlusFill } from "react-icons/bs";
import { BsThreeDots } from "react-icons/bs";
import { AuthContext } from "../App";
import { db } from "../firebase-config";
import { SelectedUserContext } from "../pages/Home";
import userData from "../userData";
import InputMessage from "./InputMessage";
import Message from "./Message";
import AttachedPicture from "./AttachedPicture";

export const SelectedChatContext = React.createContext();

function Chat() {
  const [selectedChat, setSelectedChat] = React.useState({});
  const [attachedPicture, setAttachedPicture] = React.useState({});
  const { selectedUser } = React.useContext(SelectedUserContext);
  const { currentUser } = React.useContext(AuthContext);

  console.log("selectedUser : ", selectedUser);
  console.log("currentUser : ", currentUser);

  React.useEffect(() => {
    console.log("useEffect  Chat", currentUser.uid, selectedUser);

    async function getChatData() {
      console.log("getChatData selectedUser : ", selectedUser);
      // Get message array
      const chatDocs = await getDocs(
        query(
          collection(db, `chats`),
          where(`usersId.${selectedUser}`, `==`, true),
          where(`usersId.${currentUser.uid}`, `==`, true)
        )
      );

      //   Jika document chats tidak ditemukan (belum pernah chat)
      // SetSelectedChat userData nya saja (untuk memunculkan displayName)
      if (!chatDocs.docs[0]) {
        const userDoc = await getDoc(doc(db, `users`, `${selectedUser}`));
        const userData = userDoc.data();
        console.log("userData Chat : ", userData);

        setSelectedChat({
          userData: userData,
        });

        return;
      }

      const chatData = chatDocs.docs[0].data();
      console.log("chatData : ", chatData);
      const chatId = chatDocs.docs[0].id;
      const messages = chatData.messages;

      //   console.log("messages Chat : ", messages);

      const userDoc = await getDoc(doc(db, `users`, `${selectedUser}`));
      const userData = userDoc.data();
      console.log("userData Chat : ", userData);

      setSelectedChat({
        chatId: chatId,
        userData: userData,
        messages: [...messages],
      });
    }

    getChatData();

    // const unsub = onSnapshot(
    //   query(
    //     collection(db, `chats`),
    //     where(`usersId.${selectedUser}`, `==`, true),
    //     where(`usersId.${currentUser.uid}`, `==`, true)
    //   ),
    //   (querySnapshot) => {
    //     if (querySnapshot.docs.length === 0) return;

    //     querySnapshot.docChanges().forEach((change) => {
    //       const chatData = change.doc.data();
    //       const chatId = change.doc.id;
    //       const messages = chatData.messages;

    //       console.log("messages : ", messages);
    //       setSelectedChat({ chatId: chatId, messages: [...messages] });
    //     });
    //   }
    // );

    // return () => {
    //   unsub();
    //   console.log("Cleaning Chat");
    // };
  }, [selectedUser]);

  console.log("selectedChat : ", selectedChat);

  const chatElements =
    selectedChat.messages &&
    selectedChat.messages.map((msg, index) => {
      const isOwnMsg = msg.userId === currentUser.uid;
      console.log(isOwnMsg);
      return (
        <Message
          key={index}
          className={isOwnMsg ? "owner-message" : ""}
          avatar={
            isOwnMsg ? currentUser.photoURL : selectedChat.userData.photoURL
          }
          msg={msg.message}
          time={msg.time}
          photoURL={msg.photoURL || null}
        />
      );
    });

  return (
    <div className="chat">
      <div className="user-panel">
        <span className="name">{selectedChat.userData?.displayName}</span>
        <div className="icons">
          <BsFillCameraVideoFill
            style={{
              height: "1rem",
              width: "1rem",
              fill: "var(--spr-light-clr)",
              cursor: "pointer",
            }}
          />
          <BsFillPersonPlusFill
            style={{
              height: "1rem",
              width: "1rem",
              fill: "var(--spr-light-clr)",
              cursor: "pointer",
            }}
          />
          <BsThreeDots
            style={{
              height: "1rem",
              width: "1rem",
              fill: "var(--spr-light-clr)",
              cursor: "pointer",
            }}
          />
        </div>
      </div>
      <SelectedChatContext.Provider value={{ selectedChat, setSelectedChat }}>
        {attachedPicture.message && (
          <AttachedPicture
            attachedPicture={attachedPicture}
            setAttachedPicture={setAttachedPicture}
          />
        )}
        <div className="chat-panel"> {chatElements}</div>
        <InputMessage
          attachedPicture={attachedPicture}
          setAttachedPicture={setAttachedPicture}
        />
      </SelectedChatContext.Provider>
    </div>
  );
}

export default Chat;
