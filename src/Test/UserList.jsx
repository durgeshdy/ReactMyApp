import { useState, useEffect } from "react"


export function UserList() {
    const [users, setUsers] = useState([])
    const [isEditing, setIsEditing] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [searchQuery, setSearchQuery] = useState(null)
    const [formData, setFormData] = useState({
        id: '',
        first_name: '',
        last_name: '',
        email: '',
        number: ''
    })
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
        setShowModal(true);

    }

    const handleCloseModal = () => {
        setShowModal(false);
        setFormData({
            id: "",
            first_name: "",
            last_name: "",
            email: "",
            number: "",
        });
    }
    const handleAddUser = () => {
        setIsEditing(false);
        setFormData({
            id: '',
            first_name: '',
            last_name: '',
            email: '',
            number: ''
        });
        setShowModal(true);
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
            // Reset form
            setFormData({
                id: "",
                first_name: "",
                last_name: "",
                email: "",
                number: "",
            });
        }
        setShowModal(false);
    }

    const searchFilter = (searchQuery) => {
        console.log('searchQuery',searchQuery);
        if(searchQuery) {
            const query = searchQuery.toLowerCase().trim();
            const filteredData = users.filter((user) => 
                user.first_name?.toLowerCase().includes(query) ||
                user.last_name?.toLowerCase().includes(query) ||
                user.email?.toLowerCase().includes(query)
            );
            setUsers(filteredData);
        } else {
            getAllUsers();
        }
    }
    const handleInputChange = (e) => {
        setFormData({
            ...formData, [e.target.name]: e.target.value,
        })
    }

    const getAllUsers = () =>{
         const storedUsers = JSON.parse(localStorage.getItem("userData")) || [];
        console.log('storedUsers', storedUsers);
        const sortedUsers = [...storedUsers].reverse();
        setUsers(sortedUsers);
    }

    useEffect(() => {
        getAllUsers();
    }, []);
    return (
        <div className="container mt-5 users-section">
            <h2 className="text-center mb-4">All Users</h2>

            {/* Add User Button */}
            <div className="mb-3">
                <button
                    className="btn btn-primary"
                    onClick={handleAddUser}
                >
                    Add User
                </button>
                <input className="input" placeholder="Search" value={searchQuery} onChange={(e) => searchFilter(e.target.value)}/>
            </div>

            {/* Users Table */}
            <table className="table table-striped table-bordered">
                <thead className="thead-dark">
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Number</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length > 0 ? (
                        users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.first_name}</td>
                                <td>{user.last_name}</td>
                                <td>{user.email}</td>
                                <td>{user.number}</td>
                                <td>
                                    <div className="btn-group">
                                        <button
                                            onClick={() => handleEdit(user)}
                                            className="btn btn-sm btn-outline-primary"
                                            title="Edit user"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            className="btn btn-sm btn-outline-danger"
                                            title="Delete user"
                                        >
                                            Delete
                                        </button>
                                        <button
                                            onClick={() => setSelectedUser(user)}
                                            className="btn btn-sm btn-outline-info"
                                        >
                                            View
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center">No users found</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* User Details Modal */}
            {selectedUser && (
                <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">User Details</h5>
                                {/* <button type="button" className="close" onClick={() => setSelectedUser(null)}>
                                    <span>&times;</span>
                                </button> */}
                            </div>
                            <div className="modal-body">
                                <p><strong>First Name:</strong> {selectedUser.first_name}</p>
                                <p><strong>Last Name:</strong> {selectedUser.last_name}</p>
                                <p><strong>Email:</strong> {selectedUser.email}</p>
                                <p><strong>Phone Number:</strong> {selectedUser.number}</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setSelectedUser(null)}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add/Edit User Modal */}
            {showModal && (
                <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{isEditing ? 'Edit User' : 'Add New User'}</h5>
                                {/* <button type="button" className="close mx-2" onClick={handleCloseModal}> */}
                                    {/* <span>&times;</span> */}
                                {/* </button> */}
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <label htmlFor="firstName">First Name:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="firstName"
                                            value={formData.first_name}
                                            name="first_name"
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="lastName">Last Name:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="lastName"
                                            value={formData.last_name}
                                            name="last_name"
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="email">Email:</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            name="email"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="number">Phone Number:</label>
                                        <input
                                            className="form-control"
                                            onChange={handleInputChange}
                                            type="tel"
                                            id="number"
                                            value={formData.number}
                                            name="number"
                                            pattern="[0-9]{10}"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancel</button>
                                    <button type="submit" className="btn btn-primary">
                                        {isEditing ? 'Update User' : 'Add User'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}