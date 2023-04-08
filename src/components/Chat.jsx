import {
  collection,
  doc,
  getDoc,
  getDocs,
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
import InputMessage from "./InputMessage";
import Message from "./Message";
import AttachedPicture from "./AttachedPicture";

export const SelectedChatContext = React.createContext();

function Chat() {
  const [selectedChat, setSelectedChat] = React.useState({});
  const [attachedPicture, setAttachedPicture] = React.useState({});
  const { selectedUser } = React.useContext(SelectedUserContext);
  const { currentUser } = React.useContext(AuthContext);

  React.useEffect(() => {
    async function getChatData() {
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

        setSelectedChat({
          userData: userData,
        });

        return;
      }

      const chatData = chatDocs.docs[0].data();
      const chatId = chatDocs.docs[0].id;
      const messages = chatData.messages;

      const userDoc = await getDoc(doc(db, `users`, `${selectedUser}`));
      const userData = userDoc.data();

      setSelectedChat({
        chatId: chatId,
        userData: userData,
        messages: [...messages],
      });
    }

    getChatData();
  }, [selectedUser]);

  const msgElements =
    selectedChat.messages &&
    selectedChat.messages.map((msg, index) => {
      const isOwnMsg = msg.userId === currentUser.uid;
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
        <div className="chat-panel"> {msgElements}</div>
        <InputMessage
          attachedPicture={attachedPicture}
          setAttachedPicture={setAttachedPicture}
        />
      </SelectedChatContext.Provider>
    </div>
  );
}

export default Chat;
