import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, provider, db } from '../firebase';
import { collection, query, where, getDocs, setDoc, doc } from "firebase/firestore";


export function Login({ onLogin }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // for chat
  const signInGoogle = async () => {
    try {
      console.log("signInGoogle", auth);
      console.log("provider", provider);
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error(err);
      alert('Login failed');
    }
  };

  const signInFirebase = async () => {
    try {
      await signInWithEmailAndPassword(
        auth,
        'abhisheksaral+u2@bitcot.com',
        'Bitcot@123'
      );
    } catch (err) {
      console.error(err);
    }
  };

  const registerInFirebase = async () => {
    try {
      await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
    } catch (err) {
      console.error(err);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1. Query Firestore for user
      const q = query(
        collection(db, "ReactDemoUsers"),
        where("email", "==", formData.email)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        toast.error("User not found in Firestore!");
        return;
      }

      const userDocRef = querySnapshot.docs[0];
      const userDoc = userDocRef.data();
      let userCredential;
      try {
        // Try login with Firebase Auth
        userCredential = await signInWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
      } catch (authError) {
        if (authError.code === "auth/user-not-found") {
          // ✅ If Auth user doesn't exist, create one
          userCredential = await createUserWithEmailAndPassword(
            auth,
            formData.email,
            formData.password
          );

          // Save/merge user data in Firestore with the new UID
          await setDoc(doc(db, "ReactDemoUsers", userCredential.user.uid), {
            ...userDoc,
            uid: userCredential.user.uid,
          });
        } else if (authError.code === "auth/wrong-password") {
          toast.error("Invalid password!");
          return;
        } else {
          console.error("Auth error:", authError);
          toast.error("Authentication failed!");
          return;
        }
      }
      // 4. Save login state
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("role", userDoc.role);

      // ✅ Pass role back to App state
      onLogin?.(userDoc.role);

      toast.success(`Logged in successfully as ${userDoc.role}`);

      // 5. Redirect based on role
      navigate(userDoc.role === "admin" ? "/" : "/about");
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Something went wrong!");
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   let role = null;
  //   if (formData.email === "admin@test.com" && formData.password === "123456") {
  //     role = "admin";
  //   } else if (formData.email === "user@test.com" && formData.password === "123456") {
  //     role = "user";
  //   }

  //   signInFirebase();
  //   if (role) {
  //     localStorage.setItem("isLoggedIn", "true");
  //     localStorage.setItem("role", role);

  //     // ✅ Pass role back to App state
  //     onLogin?.(role);

  //     toast.success(`Logged in successfully as ${role}`);
  //     navigate(role === "admin" ? "/" : "/about"); // redirect admin to home, user to about
  //   } else {
  //     toast.error("Invalid credentials!");
  //   }
  // }

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