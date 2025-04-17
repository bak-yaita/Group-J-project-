import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./index.css";
import Register from "./pages/auth/Register.jsx";
import Login from "./pages/auth/login.jsx";
import Assign from "./pages/registrar/Assign.jsx";
import Registrardash from "./pages/registrar/Registrardash.jsx";
import Dashbord from "./pages/students/Dashbord.jsx";
import Submission from "./pages/students/Submission.jsx";
import Issues from "./pages/students/issues.jsx";
import Profile from "./pages/students/Profile.jsx";
import Notifications from "./pages/notifications.jsx";
import Lectdash from "./pages/Lecturer/Lectdash.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route path="dashbord/" element={<Dashbord />} />
        <Route path="login/" element={<Login />} />
        <Route path="register/" element={<Register />} />
        <Route path="issues/" element={<Issues />} />
        <Route path="profile/" element={<Profile />} />
        <Route path="submission/" element={<Submission />} />
        <Route path="regdash/" element={<Registrardash />} />
        <Route path="assign/" element={<Assign />} />
        <Route path="notifications/" element={<Notifications />} />
        <Route path="lectdash/" element={<Lectdash />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
