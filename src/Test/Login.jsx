import { useState } from "react"

export function Login({ onLogin }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.email === "admin@test.com" && formData.password === "123456") {
      localStorage.setItem("isLoggedIn", "true"); // save session
      onLogin();
    } else {
      alert("Invalid credentials!");
    }

  }

  return (
    <div className="main">
      <section className="form-section">
        <div className="form-container">
          <h2>Login Page</h2>

          <form onSubmit={handleSubmit} className="user-form">
            <div className="form-row">
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInput}
                  required
                />
              </div>
              <div className="form-group">

                <input
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInput}
                  name="password"
                  required
                />
              </div>
            </div>
            <button className="btn btn-secondary" type="submit">Login</button>
          </form>
        </div>
      </section>
    </div>
  )
}