import { Navigate } from "react-router-dom";

import { useState, useEffect } from "react";

// CSS
import "./App.css";

// Components
import AppRoutes from "./routes";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Projects from "./pages/Projects";

// Route
import { Routes, Route } from "react-router-dom";

// Axios
import axios from "./api/axios";

function App() {
  // const [token, setToken] = useState(() => {
  //   const token = localStorage.getItem("auth-token");
  //   return token !== null ? token : null;
  // });
  // const getToken = ({ newToken }) => {
  //   console.log(newToken);
  //   setToken(newToken);
  // };

  return (
    <Routes>
      <Route path="/" element={<Projects />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}

export default App;
