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

        <Route path="profsettings/" element={<Profsettings />} />
        <Route path="selectrole/" element={<Selectrole />} />
=======
        <Route path="profile/" element={<Profile />} />
        <Route path="submission/" element={<Submission />} />
        <Route path="regdash/" element={<Registrardash />} />
        <Route path="assign/" element={<Assign />} />

      </Routes>
    </BrowserRouter>
  </StrictMode>
);

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
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
import Profsettings from "./pages/auth/Profsettings.jsx";
import Selectrole from "./pages/auth/Selectrole.jsx";

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
        <Route path="profsettings/" element={<Profsettings />} />
        <Route path="selectrole/" element={<Selectrole />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
=======
import Login from "./pages/auth/login.jsx";
import Assign from "./pages/registrar/Assign.jsx";
import Registrardash from "./pages/registrar/Registrardash.jsx";
import Dashbord from "./pages/students/Dashbord.jsx";
import Submission from "./pages/students/Submission.jsx";
import Issues from "./pages/students/issues.jsx";
import Profile from "./pages/students/Profile.jsx";
>>>>>>> ec830b0558bb7ba6ef8d9edafd5958e6acbcc4ca

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="dashbord/" element={<Dashbord />} />
        <Route path="login/" element={<Login />} />
        <Route path="register/" element={<Register />} />
        <Route path="issues/" element={<Issues />} />
<<<<<<< HEAD
        <Route path="profsettings/" element={<Profsettings />} />
        <Route path="selectrole/" element={<Selectrole />} />
=======
        <Route path="profile/" element={<Profile />} />
        <Route path="submission/" element={<Submission />} />
        <Route path="regdash/" element={<Registrardash />} />
        <Route path="assign/" element={<Assign />} />
>>>>>>> ec830b0558bb7ba6ef8d9edafd5958e6acbcc4ca
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
