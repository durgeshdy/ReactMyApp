import { useState, useEffect } from "react"
import { UserDetails } from "./UserDetails"

export function AddUser() {
    const [users, setUsers] = useState([])
    const [isEditing, setIsEditing] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null)
    const [formData, setFormData] = useState({
        id: '',
        first_name: '',
        last_name: '',
        email: '',
        number: ''
    })

    const handleInputChange = (e) => {
        setFormData({
            ...formData, [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!isEditing) {
            let existingUsers = JSON.parse(localStorage.getItem("userData"));
            if (!Array.isArray(existingUsers)) {
                existingUsers = [];
            }
            const newUser = {
                ...formData, id: Date.now()
            }
            const updatedUsers = [...existingUsers, newUser];
            console.log("existingUsers:", existingUsers);
            localStorage.setItem("userData", JSON.stringify(updatedUsers));
            alert(" User data saved in localStorage!");

            setUsers(updatedUsers);

            // reset form
            setFormData({
                id: '',
                first_name: '',
                last_name: '',
                email: '',
                number: ''
            })
        } else {
            const updatedUsers = users.map((user) =>
                user.id === formData.id ? formData : user
            );
            localStorage.setItem("userData", JSON.stringify(updatedUsers));
            setUsers(updatedUsers);
            setIsEditing(false)
            alert("User updated in localStorage!");
            // Reset form
            setFormData({
                id: "",
                first_name: "",
                last_name: "",
                email: "",
                number: "",
            });
        }
    }

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            const updatedUsers = users.filter((user) => user.id !== id);
            localStorage.setItem("userData", JSON.stringify(updatedUsers));
            setUsers(updatedUsers);
        }
    }
    const handleEdit = (user) => {
        setFormData(user);
        setIsEditing(true);

    }

    useEffect(() => {
        const storedUsers = JSON.parse(localStorage.getItem("userData")) || [];
        console.log('storedUsers', storedUsers);
        setUsers(storedUsers);
    }, []);

    const logout = () => {
        localStorage.removeItem("isLoggedIn");
        window.location.reload();
    }

    return (
        <div>
            <div className="main">
                <section className="form-section">
                    <div className="form-container ">
                        <h2 className="bg-gray-100">User Information Form</h2>
                        <form onSubmit={handleSubmit} className="main user-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>First Name:</label>
                                    <input
                                        type="text"
                                        id="firstName"
                                        value={formData.first_name}
                                        name="first_name"
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">

                                    <label>Last Name:</label>
                                    <input
                                        type="text"
                                        id="lastName"
                                        value={formData.last_name}
                                        name="last_name"
                                        onChange={handleInputChange}
                                        required />
                                </div>
                                <div className="form-group">

                                    <label>Email:</label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        name="email" required />
                                </div>
                                <div className="form-group">
                                    <label>Phone Number:</label>
                                    <input
                                        onChange={handleInputChange}
                                        type="tel"
                                        id="number"
                                        value={formData.number}
                                        name="number"
                                        pattern="[0-9]{10}"
                                        required /></div>

                                <button className="btn btn-primary" type="submit">Submit</button>
                            </div>

                        </form>
                    </div>
                </section><br/>

                <section className="users-section">
                    <div className="form-container">
                    <h2>All Users</h2>
                    <table>
                        <tr>
                            <th>
                                First Name
                            </th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th>Number</th>
                        </tr>
                        {users.length > 0 ? (
                            users.map((user, index) => (
                                <tr key={index}>
                                    <td>{user.first_name}</td>
                                    <td>{user.last_name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.number}</td>
                                    <td><button onClick={() => handleEdit(user)} className="btn text-green-500">Edit</button></td>
                                    <td> <button onClick={() => handleDelete(user.id)} className="btn text-green-500">Delete</button></td>
                                    <td><button onClick={() => setSelectedUser(user)} className="btn text-green-500">View</button></td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4">No users found</td>
                            </tr>
                        )}

                    </table>
                    {selectedUser && (
                        <UserDetails user={selectedUser} onClose={() => setSelectedUser(null)} />
                    )}
                    <button onClick={() => logout()} className="btn">logout</button>
                    </div>
                </section>
            </div>
        </div>
    )
}
