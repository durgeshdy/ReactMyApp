export  function UserDetails({user, onClose}){
    if (!user) return null;


    return (
        <div style={{ border: "1px solid gray", padding: "10px", marginTop: "10px" }}>
        <h3>User Details</h3>
        <p><strong>First Name:</strong> {user.first_name}</p>
        <p><strong>Last Name:</strong> {user.last_name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Number:</strong> {user.number}</p>
  
        <button onClick={onClose}>Close</button>
      </div>
    )
}