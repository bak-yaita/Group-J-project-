import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./index.css";
import Details from "./pages/Lecturer/Details.jsx";
import Issuess from "./pages/Lecturer/Issuess.jsx";
import LProfile from "./pages/Lecturer/LProfile.jsx";
import Lectdash from "./pages/Lecturer/Lectdash.jsx";
import Resolve from "./pages/Lecturer/Resolve.jsx";
import Home from "./pages/auth/Home.jsx";
import Register from "./pages/auth/Register.jsx";
import Login from "./pages/auth/login.jsx";
import Notifications from "./pages/notifications.jsx";
import Assign from "./pages/registrar/Assign.jsx";
import RProfile from "./pages/registrar/RProfile.jsx";
import RResolve from "./pages/registrar/RResolve.jsx";
import Registrardash from "./pages/registrar/Registrardash.jsx";
import Dashbord from "./pages/students/Dashbord.jsx";
import Profile from "./pages/students/Profile.jsx";
import Submission from "./pages/students/Submission.jsx";
import HODdash from "./pages/Lecturer/HODdash.jsx";
import Lnotifications from "./pages/Lecturer/Lnotifications.jsx";
import Rnotifications from "./pages/registrar/Rnotifications.jsx";
import "flowbite";
import { initFlowbite } from "flowbite";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route path="dashbord/" element={<Dashbord />} />
        <Route path="login/" element={<Login />} />
        <Route path="register/" element={<Register />} />
        <Route path="profile/" element={<Profile />} />
        <Route path="submission/" element={<Submission />} />
        <Route path="regdash/" element={<Registrardash />} />
        <Route path="assign/" element={<Assign />} />
        <Route path="notifications/" element={<Notifications />} />
        <Route path="lectdash/" element={<Lectdash />} />
        <Route path="viewdetails/" element={<Details />} />
        <Route path="issue/" element={<Issuess />} />
        <Route path="lprofile/" element={<LProfile />} />
        <Route path="rprofile/" element={<RProfile />} />
        <Route path="resolve/" element={<Resolve />} />
        <Route path="rresolve/" element={<RResolve />} />
        <Route path="hoddash/" element={<HODdash />} />
        <Route path="lnotif/" element={<Lnotifications />} />
        <Route path="rnotif/" element={<Rnotifications />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
initFlowbite();