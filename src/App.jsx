import { useState, useEffect } from 'react'
import { Header } from './Header'
import './App.css'
import Footer from './Footer'
import { AddUser } from './Test/AddUser'
import  Home from './Test/Home'
import  About from './Test/About'
import  Crud from './Crud'
import { Login } from './Test/Login'


import { Routes, Route, Link } from "react-router-dom";
import { UserList } from './Test/UserList'


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loginStatus = localStorage.getItem('isLoggedIn');
    if (loginStatus === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <div className="app">
      {isLoggedIn  ? (
        <div>
            <header className='header-wrapper'>
              <Link to="/" className="nav-btn">Home</Link>
              <Link to="/about" className="nav-btn">About</Link>
              <Link to="/add-user" className="nav-btn">Add User</Link>
              <Link to="/crud" className="nav-btn">Crud</Link>
              <Link to="/user-list" className="nav-btn">User List</Link>

            </header>
            <main className='main-wrapper'>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/add-user" element={<AddUser />} />
                <Route path="/crud" element={<Crud />} />
                <Route path="/user-list" element={<UserList />} />
              </Routes>
            </main>
      </div>

      ) : (
        <Login onLogin={() => setIsLoggedIn(true)} />
        )}

    
      

    </div>
  )
}

export default App
