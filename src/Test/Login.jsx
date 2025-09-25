import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


export function Login({ onLogin }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    let role = null;
    if (formData.email === "admin@test.com" && formData.password === "123456") {
      role = "admin";
    } else if (formData.email === "user@test.com" && formData.password === "123456") {
      role = "user";
    }

    if (role) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("role", role);

      // ✅ Pass role back to App state
      onLogin?.(role);

      toast.success(`Logged in successfully as ${role}`);
      navigate(role === "admin" ? "/" : "/about"); // redirect admin to home, user to about
    } else {
      toast.error("Invalid credentials!");
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