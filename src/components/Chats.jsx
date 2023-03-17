import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import React from "react";
import { AuthContext } from "../App";
import { db } from "../firebase-config";
import data from "../messageData";
import { SelectedUserContext } from "../pages/Home";
import userData from "../userData";
import UserChat from "./UserChat";

export const ChatsContext = React.createContext();

function Chats() {
  const [chats, setChats] = React.useState([]);
  const { selectedUser } = React.useContext(SelectedUserContext);
  const { currentUser } = React.useContext(AuthContext);

  //   1. listen penambahan data chats
  // 2. Cek apakah usersId nya cocok
  // 3. Jika cocok, gabungkan pada chats

  //   React.useEffect(() => {
  //     console.log("useEffect Chats deteksi penambahan userChat");
  //     let newChats = [];

  //     const unsub = onSnapshot(
  //       collection(
  //         db,
  //         `userChats`,
  //         `${currentUser.uid}`,
  //         `chatInfo`,
  //         `${selectedUser}`
  //       ), (querySnapshot)=>{

  // 	  }
  //     );
  //     return () => {
  //       unsub();
  //     };
  //   }, []);

  React.useEffect(() => {
    console.log("useEffect Chats");
    let newChats = [];

    const unsub = onSnapshot(
      collection(db, `userChats`, `${currentUser.uid}`, `chatInfo`),
      async (querySnapshot) => {
        console.log("ONSNAPSHOT CHATS");
        const userChatsDocs = await getDocs(
          query(
            collection(db, `userChats`, `${currentUser.uid}`, `chatInfo`),
            orderBy("date", "desc")
          )
        );
        userChatsDocs.forEach((userChatDoc) => {
          const userChatData = userChatDoc.data();
          console.log("userChatData Chats : ", userChatData);
          newChats.push(userChatData);
        });
        setChats(newChats);
        console.log("newChats : ", newChats);
        newChats = [];
        // querySnapshot.docChanges().forEach((change) => {
        //   if (change.type === "modified") {
        //     const newChatData = change.doc.data();
        //     console.log("newChatData : ", newChatData);

        //     newChats = newChats.filter(
        //       (chat) => chat.userInfo.uid !== newChatData.userInfo.uid
        //     );
        //     newChats.unshift(newChatData);
        //     console.log("newChats after modified", newChats);
        //     setChats(newChats);
        //   }
        // });
      }
    );

    // async function getUserChats() {
    //   const userChatsDocs = await getDocs(
    //     collection(db, `userChats`, `${currentUser.uid}`, `chatInfo`)
    //   );
    //   userChatsDocs.forEach((userChatDoc) => {
    //     const userChatData = userChatDoc.data();
    //     console.log("userChatData Chats : ", userChatData);
    //     newChats.push(userChatData);
    //   });
    //   setChats(newChats);
    //   console.log("newChats : ", newChats);
    // }
    // getUserChats();
    return () => {
      unsub();
    };
  }, []);

  //   React.useEffect(() => {
  //     let newChats = chats;
  //     // Detect data changes in userChats
  //     const unsub = onSnapshot(
  //       collection(db, `userChats`, `${currentUser.uid}`, `chatInfo`),
  //       (querySnapshot) => {

  //         // querySnapshot.docChanges().forEach((change) => {
  //         //   if (change.type === "modified") {
  //         //     const newChatData = change.doc.data();
  //         //     console.log("newChatData : ", newChatData);

  //         //     newChats = newChats.filter(
  //         //       (chat) => chat.userInfo.uid !== newChatData.userInfo.uid
  //         //     );
  //         //     newChats.unshift(newChatData);
  //         //     console.log("newChats after modified", newChats);
  //         //     setChats(newChats);
  //         //   }
  //         // });

  //         // const chatsFiltered = chats.filter((chat) => !newChats.includes(chat));
  //         // newChats = [...newChats, ...chatsFiltered];
  //         // console.log("newChats after modified : ", newChats);
  //         // console.log(
  //         //   "querySnapshot.docChanges() : ",
  //         //   querySnapshot.docChanges()
  //         // );
  //         // console.log("querySnapshot.docs Chats : ", querySnapshot.docs);
  //         // querySnapshot.docs.forEach((doc) => {
  //         //   const chatData = doc.data();
  //         // });
  //       }
  //     );
  //     return () => {
  //       unsub();
  //     };
  //   }, []);

  //   React.useEffect(() => {
  //     let newChats = [];

  //     // Detect new data in userChats
  //     const unsub = onSnapshot(
  //       query(
  //         collection(db, `userChats`, `${currentUser.uid}`, `chatInfo`),
  //         where(`userInfo.uid`, `==`, `${selectedUser}`)
  //       ),
  //       (querySnapshot) => {
  //         console.log(
  //           "querySnapshot.docs.length (Chats) : ",
  //           querySnapshot.docs.length
  //         );
  //         // console.log(querySnapshot.docChanges());
  //         // console.log(querySnapshot.docs);
  //         if (querySnapshot.docs.length > 0) {
  //           querySnapshot.docChanges().forEach((change) => {
  //             const changeData = change.doc.data();
  //             console.log("changeData : ", changeData);
  //             newChats.push(changeData);
  //           });
  //           console.log("newChats : ", newChats);
  //           setChats(newChats);
  //         }
  //       }
  //     );
  //     return () => {
  //       console.log("cleaning onSnapshot Chats");
  //       unsub();
  //     };
  //     // async function getUserChats() {
  //     //   const snapshot = await getDocs(
  //     //     collection(db, `userChats`, `${currentUser.uid}`, `chatInfo`)
  //     //   );
  //     //   snapshot.forEach((snap) => {});
  //     // }
  //   }, [selectedUser]);

  //   console.log("selectedUser (Chats) : ", selectedUser);
  //   console.log("Chats (Chats) : ", chats);

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
  //   return <div className="chats">cek</div>;
}

export default Chats;
