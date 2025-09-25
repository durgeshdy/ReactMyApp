import { useState, useEffect } from 'react'
import { Header } from './Header'
import './App.css'
import Footer from './Footer'
import { AddUser } from './Test/AddUser'
import Home from './Test/Home'
import About from './Test/About'
import Crud from './Crud'
import { Login } from './Test/Login'
import UserLayout from './CommonComponents/UserLayout'
import AdminLayout from './CommonComponents/AdminLayout'
import ProtectedLayout from "./ProtectedLayout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";




import { Routes, Route, Link } from "react-router-dom";
import { UserList } from './Test/UserList'


function App() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking localStorage once on mount
    const loginStatus = localStorage.getItem("isLoggedIn") === "true";
    const storedRole = localStorage.getItem("role");
    setIsLoggedIn(loginStatus);
    setRole(storedRole);
    setLoading(false);
  }, []);


  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    setRole(null);
    toast.success("Logged out successfully!");
    navigate("/login");
  }

  if (loading) {
    return <div>Loading...</div>; // ✅ prevents flicker before role is loaded
  }



  return (
    <div className="app">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      {isLoggedIn ? (
        <div>
          <header className='header-wrapper'>
            {role === "admin" && (
              <>
                <Link to="/" className="nav-btn">Home</Link>
                <Link to="/about" className="nav-btn">About</Link>
                <Link to="/add-user" className="nav-btn">Add User</Link>
                <Link to="/crud" className="nav-btn">Crud</Link>
                <Link to="/user-list" className="nav-btn">User List</Link>
              </>
            )}
            <button onClick={() => handleLogout()} className="btn">logout</button>


            {role === "user" && (
              <>
                <Link to="/about" className="nav-btn">About</Link>
              </>
            )}

          </header>
          <main className='main-wrapper'>
            <Routes>
              {/*  Public route */}
              <Route path="/login" element={<Login />} />
              {/* User Layout */}
              <Route element={<ProtectedLayout allowedRole="user" Layout={UserLayout} />}>
                <Route path="/about" element={<About />} />
              </Route>
              {/* Admin Layout */}
              <Route element={<ProtectedLayout allowedRole="admin" Layout={AdminLayout} />}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/add-user" element={<AddUser />} />
                <Route path="/crud" element={<Crud />} />
                <Route path="/user-list" element={<UserList />} />
              </Route>
            </Routes>
          </main>
        </div>

      ) : (
        <Login onLogin={(role) => { setIsLoggedIn(true); setRole(role); }} />
      )}
    </div>
  )
}

export default App
