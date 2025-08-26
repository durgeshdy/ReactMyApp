import { useState, useEffect } from 'react'
import { Header } from './Header'
import './App.css'
import Footer from './Footer'

function App() {
  const [users, setUsers] = useState([])
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    phone: '',
    role: 'user'
  })
  const [isEditing, setIsEditing] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  // Initialize with sample data
  useEffect(() => {
    const sampleUsers = [
      { id: 1, name: 'Lalu', email: 'lalu@gmail.com', phone: '+1234567890', role: 'admin' },
      { id: 2, name: 'namu', email: 'namu@gmail.com', phone: '+1234567891', role: 'user' },
      { id: 3, name: 'Sam', email: 'Sam@gmail.com', phone: '+1234567892', role: 'user' }
    ]
    setUsers(sampleUsers)
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (isEditing) {
      // Update existing user
      setUsers(prev => prev.map(user => 
        user.id === formData.id ? formData : user
      ))
      setIsEditing(false)
    } else {
      // Create new user
      const newUser = {
        ...formData,
        id: Date.now()
      }
      setUsers(prev => [...prev, newUser])
    }
    
    // Reset form
    setFormData({
      id: '',
      name: '',
      email: '',
      phone: '',
      role: 'user'
    })
  }

  const handleEdit = (user) => {
    setFormData(user)
    setIsEditing(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(prev => prev.filter(user => user.id !== id))
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setFormData({
      id: '',
      name: '',
      email: '',
      phone: '',
      role: 'user'
    })
  }

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  )
  return (
    <div className="app">
      <Header />
      <main className="main" >
        {/* Form Section */}
        <section className="form-section">
          <div className="form-container">
            <h2>{isEditing ? 'Edit User' : 'Add New User'}</h2>
            <form onSubmit={handleSubmit} className="user-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">First Name</label>
                  <input
                    type="text"
                    id="name"
                    name="first_names"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter full name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter email address"
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="role">Role</label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="moderator">Moderator</option>
                  </select>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  {isEditing ? 'Update User' : 'Add User'}
                </button>
                {isEditing && (
                  <button type="button" onClick={handleCancel} className="btn btn-secondary">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </section>

        {/* Users List Section */}
        <section className="users-section">
          <div className="users-header">
            <h2>Users ({filteredUsers.length})</h2>
            <div className="search-container">
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          <div className="users-grid">
            {filteredUsers.length === 0 ? (
              <div className="no-users">
                <p>No users found</p>
              </div>
            ) : (
              filteredUsers.map(user => (
                <div key={user.id} className="user-card">
                  <div className="user-info">
                    <h3>{user.name}</h3>
                    <p className="user-email">{user.email}</p>
                    <p className="user-phone">{user.phone}</p>
                    <span className={`user-role user-role-${user.role}`}>
                      {user.role}
                    </span>
                  </div>
                  <div className="user-actions">
                    <button
                      onClick={() => handleEdit(user)}
                      className="btn btn-edit"
                      title="Edit user"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="btn btn-delete"
                      title="Delete user"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default App
