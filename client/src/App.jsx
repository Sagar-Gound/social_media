import React from "react";
import Home from "./pages/home/Home";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Profile from "./pages/profile/Profile";
import { useContext, useEffect } from "react";
import { AuthContext } from "./context/AuthContext";
import Messenger from "./pages/messenger/Messenger";

function ProtectedRoute({ children }) {
  const { user: currentUser, dispatch } = useContext(AuthContext);
  const isValidUser = Boolean(currentUser && currentUser._id);

  useEffect(() => {
    if (!isValidUser) {
      localStorage.removeItem("user");
      dispatch({ type: "LOGOUT" });
    }
  }, [dispatch, isValidUser]);

  if (!isValidUser) {
    return <Navigate replace to="/register" />;
  }

  return children;
}

function App() {
  const { user: currentUser } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          exact
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
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
          element={
            <ProtectedRoute>
              <Messenger />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/:id"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
