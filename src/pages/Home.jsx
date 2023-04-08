import React from "react";
import Sidebar from "../components/Sidebar";
import Chat from "../components/Chat";

export const SelectedUserContext = React.createContext();

function Home() {
  const [selectedUser, setSelectedUser] = React.useState("");

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
}

export default Home;
