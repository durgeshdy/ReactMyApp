import { useState } from "react"

export function Login({onLogin}) {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const handleInput = (e) => {
        setFormData({ ...formData, [e.target.name]:  e.target.value })
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
        <div>
        <h2>Login Page</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInput}
            required
          />
          <br /><br />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInput}
            name="password"
            required
          />
          <br /><br />
          <button type="submit">Login</button>
        </form>
      </div>
    )
}