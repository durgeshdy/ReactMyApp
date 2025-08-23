export function AddUser() {

    return (
            <div>
                <h2 className="bg-gray-100">User Information Form</h2>
                <form>
                    <label>First Name:</label><br/>
                    <input type="text" id="firstName" name="firstName" required /><br/><br/>
                   

                    <label>Last Name:</label><br/>
                    <input type="text" id="lastName" name="lastName" required /><br/><br/>

                    <label>Email:</label><br/>
                    <input type="email" id="email" name="email" required /><br/><br/>

                    <label>Phone Number:</label><br/>
                    <input type="tel" id="number" name="number" pattern="[0-9]{10}" placeholder="1234567890" required /><br/><br/>

                    <button type="submit">Submit</button>
                    
                </form>

            </div>
    )
}
