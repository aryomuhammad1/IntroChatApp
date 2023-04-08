import {
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import React from "react";
import { AuthContext } from "../App";
import { db } from "../firebase-config";
import { SelectedUserContext } from "../pages/Home";
import UserChat from "./UserChat";

export const ChatsContext = React.createContext();

function Chats() {
  const [chats, setChats] = React.useState([]);
  const { selectedUser } = React.useContext(SelectedUserContext);
  const { currentUser } = React.useContext(AuthContext);

  // 1. Listen perubahan data chats / userChats
  // 2. Jika ada, maka ambil ulang data chats berdasar urutan date
  // 3. Set chats state untuk trigger update UI

  React.useEffect(() => {
    let newChats = [];

    const unsub = onSnapshot(
      collection(db, `userChats`, `${currentUser.uid}`, `chatInfo`),
      async () => {
        const userChatsDocs = await getDocs(
          query(
            collection(db, `userChats`, `${currentUser.uid}`, `chatInfo`),
            orderBy("date", "desc")
          )
        );
        userChatsDocs.forEach((userChatDoc) => {
          const userChatData = userChatDoc.data();
          newChats.push(userChatData);
        });
        setChats(newChats);
        newChats = [];
      }
    );

    return () => {
      unsub();
    };
  }, []);

  const userChatElements = chats.map((userChatData) => {
    const isSelected = selectedUser === userChatData.userInfo.uid;

    return (
      <UserChat
        isRead={userChatData.userInfo.isRead}
        key={userChatData.userInfo.uid}
        id={userChatData.userInfo.uid}
        isSelected={isSelected}
        avatar={userChatData.userInfo.photoURL}
        ltsMsg={userChatData.userInfo.ltsMsg}
        time={userChatData.userInfo.time}
        displayName={userChatData.userInfo.displayName}
        photoIncluded={userChatData.userInfo.photoIncluded}
      />
    );
  });

  return (
    <ChatsContext.Provider value={{ chats, setChats }}>
      <div className="chats">{userChatElements}</div>;
    </ChatsContext.Provider>
  );
}

export default Chats;
