// Externals
import { onAuthStateChanged } from "firebase/auth";
import React from "react";
import { useNavigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { auth } from "./firebase-config";

// Components
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

export const AuthContext = React.createContext(null);

function App() {
  // ===Hooks===
  const [currentUser, setCurrentUser] = React.useState();
  //   console.log("currentUser after set: ", currentUser);

  const navigate = useNavigate();

  //   onAuhStateChanged tidak digunakan untuk login
  React.useEffect(() => {
    // cek localstorage
    const cek = localStorage.getItem("currentUser");
    console.log("CEKKK : ", JSON.parse(cek));
    // if ada token
    // setState
    if (cek) {
      setCurrentUser(JSON.parse(cek));
      navigate("/");
      return;
    }
    // if tidak ada :
    console.log("useEffect");
    const unsub = onAuthStateChanged(auth, (user) => {
      console.log("USER TOKEN : ", user);
      if (user) {
        localStorage.setItem("currentUser", JSON.stringify(user));
        setCurrentUser(user);
      }
    });
    return () => {
      console.log("cleaning");
      unsub();
    };
  }, []);

  // ===JSX===
  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
      <Routes>
        <Route path="/">
          <Route
            index
            element={
              <ProtectedRoute currentUser={currentUser}>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="Login" element={<Login />} />
          <Route path="Register" element={<Register />} />
        </Route>
      </Routes>
    </AuthContext.Provider>
  );
}

export default App;

// Catatan :
// Jika ada sebuah halaman/component yang butuh akses khusus, maka kita bisa me-wrapping component tersebut
// (element Route) dengan component baru yang disebut ProtectedRoute, untuk memfilter hak akses.
// Jika tdk memiliki akses, user akan dialihkan (navigate) ke halaman login,
//  jika memiliki akses, maka ProtectedRoute akan merender children component.

// Jika ada 2 atau lebih halaman yang butuh akses khusus, dengan persyaratan yang sama,
// maka bisa dilakukan cara diatas, namun yang di-wrapping tidak hanya component nya saja,
// tapi Route nya sekalian.
// Jika pada cara diatas ProtectedRoute akan merender children, maka pada cara ini
// yang dirender adalah <Outlet />, yang merupakan Route Children.
