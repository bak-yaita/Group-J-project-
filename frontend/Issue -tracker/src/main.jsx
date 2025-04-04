import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./index.css";
import App from "./App.jsx";
import Register from "./pages/auth/Register.jsx";
import Selectrole from "./pages/auth/Selectrole.jsx";
import Login from "./pages/auth/login.jsx";
import Assign from "./pages/registrar/Assign.jsx";
import Registrardash from "./pages/registrar/Registrardash.jsx";
import Dashbord from "./pages/students/Dashbord.jsx";
import Submission from "./pages/students/Submission.jsx";
import Issues from "./pages/students/issues.jsx";
import Profile from "./pages/students/Profile.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="dashbord/" element={<Dashbord />} />
        <Route path="login/" element={<Login />} />
        <Route path="register/" element={<Register />} />
        <Route path="issues/" element={<Issues />} />
        <Route path="profile/" element={<Profile />} />
        <Route path="selectrole/" element={<Selectrole />} />
        <Route path="submission/" element={<Submission />} />
        <Route path="regdash/" element={<Registrardash />} />
        <Route path="assign/" element={<Assign />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
