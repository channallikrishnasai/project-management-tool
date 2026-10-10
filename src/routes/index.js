// Route
import { Routes, Route } from "react-router-dom";

// Components
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Projects from "../pages/Projects";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/projects" element={<Projects />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
};

export default AppRoutes;
