import { useState, useEffect } from "react"
import { getItems } from '../apiService';
import { toast } from "react-toastify";
import Swal from "sweetalert2";


export function UserList() {
    const [users, setUsers] = useState([])
    const [isEditing, setIsEditing] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [formData, setFormData] = useState({
        id: '',
        first_name: '',
        last_name: '',
        email: '',
        number: '',
        profile_image: null
    })
    const [imagePreview, setImagePreview] = useState(null);

    const handleDelete = (userId) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You want to delete this user!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                // Perform delete logic
                const updatedUsers = users.filter((user) => user.id !== userId);
                localStorage.setItem("userData", JSON.stringify(updatedUsers));
                setUsers(updatedUsers);
                toast.success(`User has been deleted`);
            }
        });
    };

    const handleEdit = (user) => {
        setFormData(user);
        setIsEditing(true);
        setShowModal(true);
        if (user.profile_image) {
            setImagePreview(user.profile_image);
        } else {
            setImagePreview(null);
        }

    }

    const handleCloseModal = () => {
        setShowModal(false);
        setFormData({
            id: "",
            first_name: "",
            last_name: "",
            email: "",
            number: "",
            profile_image: null
        });
    }
    const handleAddUser = () => {
        setIsEditing(false);
        setFormData({
            id: '',
            first_name: '',
            last_name: '',
            email: '',
            number: '',
            profile_image: null

        });
        setImagePreview(null);
        setShowModal(true);
    }
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const imageDataUrl = reader.result;
                setFormData({
                    ...formData,
                    profile_image: imageDataUrl
                });
                setImagePreview(imageDataUrl);
            };
            reader.readAsDataURL(file);
        }
    };
    const handleRemoveImage = () => {
        setFormData({
            ...formData,
            profile_image: null
        });
        setImagePreview(null);
    };

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
                number: '',
                profile_image: null
            })
            toast.success(`User added successfully`);
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
                profile_image: null

            });
            toast.success(`User updated successfully`);
        }
        setImagePreview(null);
        setShowModal(false);
    }

    // const searchFilter = (searchQuery) => {
    //     console.log('searchQuery',searchQuery);
    //     if(searchQuery) {
    //         const query = searchQuery.toLowerCase().trim();
    //         const filteredData = users.filter((user) => 
    //             user.first_name?.toLowerCase().includes(query) ||
    //             user.last_name?.toLowerCase().includes(query) ||
    //             user.email?.toLowerCase().includes(query)
    //         );
    //         setUsers(filteredData);
    //     } else {
    //         getAllUsers();
    //     }
    // }
    const handleInputChange = (e) => {
        setFormData({
            ...formData, [e.target.name]: e.target.value,
        })
    }

    const getAllUsers = () => {
        const storedUsers = JSON.parse(localStorage.getItem("userData")) || [];
        console.log('storedUsers', storedUsers);
        const sortedUsers = [...storedUsers].reverse();
        setUsers(sortedUsers);
    }

    const query = searchQuery;
    const filteredUsers = users.filter(user =>
        user.first_name?.toLowerCase().includes(query) ||
        user.last_name?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query) ||
        user.number?.toLowerCase().includes(query)
    )

    useEffect(() => {
        getAllUsers();
        getItems()
            .then(response => console.log(response.data))
            .catch(error => console.error('Error fetching items:', error));
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
                <input className="input" placeholder="Search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>

            {/* Users Table */}
            <table className="table table-striped table-bordered">
                <thead className="thead-dark">
                    <tr>
                        <th>Profile</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Number</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                            <tr key={user.id}>
                                <td className="text-center">
                                    {user.profile_image ? (
                                        <img
                                            src={user.profile_image}
                                            alt="Profile"
                                            className="rounded-circle"
                                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <div
                                            className="rounded-circle d-flex align-items-center justify-content-center mx-auto"
                                            style={{
                                                width: '50px',
                                                height: '50px',
                                                backgroundColor: '#f0f0f0',
                                                color: '#999'
                                            }}
                                        >
                                            No Image
                                        </div>
                                    )}
                                </td>
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
                            <div className="modal-body text-center">
                                {selectedUser.profile_image ? (
                                    <img
                                        src={selectedUser.profile_image}
                                        alt="Profile"
                                        className="rounded-circle mb-3"
                                        style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <div
                                        className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                                        style={{
                                            width: '120px',
                                            height: '120px',
                                            backgroundColor: '#f0f0f0',
                                            color: '#999'
                                        }}
                                    >
                                        No Image
                                    </div>
                                )}
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
                                    <div className="row">
                                        <div className="col-md-4 text-center">
                                            <div className="mb-3">
                                                {imagePreview ? (
                                                    <div className="position-relative d-inline-block">
                                                        <img
                                                            src={imagePreview}
                                                            alt="Profile Preview"
                                                            className="rounded-circle"
                                                            style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                                                        />
                                                        <button
                                                            type="button"
                                                            className="btn btn-danger btn-sm position-absolute top-0 end-0 rounded-circle"
                                                            onClick={handleRemoveImage}
                                                            style={{ width: '30px', height: '30px' }}
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div
                                                        className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2"
                                                        style={{
                                                            width: '150px',
                                                            height: '150px',
                                                            backgroundColor: '#f0f0f0',
                                                            color: '#999'
                                                        }}
                                                    >
                                                        No Image
                                                    </div>
                                                )}
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="profileImage" className="btn btn-outline-primary btn-sm">
                                                    Upload Profile Image
                                                </label>
                                                <input
                                                    type="file"
                                                    id="profileImage"
                                                    className="d-none"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-8">
                                            <div className="form-group mb-3">
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
                                            <div className="form-group mb-3">
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
                                            <div className="form-group mb-3">
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
                                            <div className="form-group mb-3">
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