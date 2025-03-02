import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import './index.css'
import App from './App.jsx'
import Dashbord from './pages/students/Dashbord.jsx'
import Login from './pages/auth/login.jsx'
import Register from './pages/auth/Register.jsx'
import Issues from './pages/students/issues.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="dashbord/" element={<Dashbord/>}/>
        <Route path="login/" element={<Login/>}/>
        <Route path="register/" element={<Register/>}/>
        <Route path="issues/" element={<Issues/>}/>

      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
