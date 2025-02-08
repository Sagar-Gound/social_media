import React from "react";
import Home from "./pages/home/Home";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Profile from "./pages/profile/Profile";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Messenger from "./pages/messenger/Messenger";

function App() {
  const { user: currentUser } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={currentUser ? <Home /> : <Login />} />
        <Route
          path="/login"
          element={currentUser ? <Navigate replace to="/" /> : <Login />}
        />
        <Route
          path="/register"
          element={currentUser ? <Navigate replace to="/" /> : <Register />}
        />
        <Route
          path="/messenger"
          element={!currentUser ? <Navigate replace to="/" /> : <Messenger />}
        />
        <Route path="/profile/:id" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
