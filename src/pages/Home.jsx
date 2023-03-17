// External
import React from "react";
import { auth, db } from "../firebase-config";

// Components
import Sidebar from "../components/Sidebar";
import Chat from "../components/Chat";
import { doc, getDoc } from "firebase/firestore";
import { AuthContext } from "../App";

export const SelectedUserContext = React.createContext();

// Hooks
function Home() {
  const [selectedUser, setSelectedUser] = React.useState("");
  //   console.log("selectedUser (Home) : ", selectedUser);
  //   const currentUser = React.useContext(AuthContext);

  return (
    <SelectedUserContext.Provider value={{ selectedUser, setSelectedUser }}>
      <div className="home">
        <div className="container">
          <Sidebar />
          <Chat />
        </div>
      </div>
    </SelectedUserContext.Provider>
  );
  //   return <Register />;
}

export default Home;
