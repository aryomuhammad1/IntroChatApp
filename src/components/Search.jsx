import { collection, getDocs, query, where } from "firebase/firestore";
import React from "react";
import { AuthContext } from "../App";
import { db } from "../firebase-config";
import data from "../messageData";
import UserChat from "./UserChat";
import { FaSearch } from "react-icons/fa";

function Search() {
  const [searched, setSearched] = React.useState([]);
  const { currentUser } = React.useContext(AuthContext);

  async function searchAccount(e) {
    const keyword = e.target.value;
    let foundedUser = [];

    if (keyword === "") {
      setSearched([]);
      return;
    }
    if (keyword === currentUser.uid) {
      console.log("keyword == uid");
      return;
    }

    const snapshot = await getDocs(query(collection(db, `users`)));
    snapshot.forEach((doc) => {
      const userData = doc.data();
      userData.uid = doc.id;
      console.log("userData Search : ", userData);
      const displayName = userData.displayName.toLowerCase();
      displayName.includes(keyword) && foundedUser.push(userData);
    });
    console.log("foundedUser : ", foundedUser);
    setSearched(foundedUser);
  }

  console.log("searched : ", searched);

  const userSearchedElements = searched.map((user, index) => {
    return (
      <UserChat
        key={index}
        id={user.uid}
        avatar={user.photoURL}
        displayName={user.displayName}
        setSearched={setSearched}
        searched={searched}
      />
    );
  });

  return (
    <div className="search">
      {/* <form onSubmit={searchAccount}> */}
      <form>
        <FaSearch
          style={{
            height: ".9rem",
            width: ".9rem",
            position: "absolute",
            fill: "var(--spr-light-clr)",
            top: "0.65rem",
            bottom: "0.65rem",
            left: "1rem",
          }}
        />
        <input
          type="text"
          name="name"
          placeholder="Find a user"
          onChange={searchAccount}
          autoComplete="off"
          //   value={searched}
          //   onChange={handleSearchChange}
        />
      </form>
      {userSearchedElements}
    </div>
  );
}

export default Search;
