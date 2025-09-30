// src/components/ChatRoom.jsx
import React, { useEffect, useRef, useState } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  getDocs,
  where
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function ChatRoom() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const dummy = useRef();

  // 🔹 Listen for auth state and fetch Firestore user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const q = query(
            collection(db, "ReactDemoUsers"),
            where("email", "==", currentUser.email)
          );
          const snapshot = await getDocs(q);

          if (!snapshot.empty) {
            const docData = snapshot.docs[0].data();
            const docId = snapshot.docs[0].id;

            setUser({
              uid: currentUser.uid,
              email: currentUser.email,
              id: docId, // save Firestore document ID
              ...docData,
            });
          } else {
            setUser({
              uid: currentUser.uid,
              email: currentUser.email,
              id: currentUser.uid, // fallback if not in Firestore
            });
          }
        } catch (error) {
          console.error("Error fetching user:", error);
          setUser(currentUser);
        }
      } else {
        setUser(null);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 🔹 Load all registered users except self
  useEffect(() => {
    if (!user) return;

    const fetchUsers = async () => {
      try {
        const snapshot = await getDocs(collection(db, "ReactDemoUsers"));
        const list = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((u) => u.email !== user.email); // exclude self
        setUsers(list);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [user]);

  // 🔹 Generate chat ID based on user IDs
  const getChatId = (id1, id2) => {
    return [id1, id2].sort().join("_");
  };

  // 🔹 Listen for chat messages
  useEffect(() => {
    if (!selectedUser || !user?.id || !selectedUser?.id) return;

    const chatId = getChatId(user.id, selectedUser.id);
    const messagesQuery = query(
      collection(db, "ReactDemoChats", chatId, "messages"),
      orderBy("createdAt")
    );

    const unsub = onSnapshot(messagesQuery, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(msgs);

      setTimeout(() => {
        dummy.current?.scrollIntoView({ behavior: "smooth" });
      }, 50);
    });

    return () => unsub();
  }, [selectedUser, user]);

  // 🔹 Send message
  const sendMessage = async (e) => {
    e.preventDefault();

    if (!text.trim() || !user?.id || !selectedUser?.id) return;

    const chatId = getChatId(user.id, selectedUser.id);

    try {
      await addDoc(collection(db, "ReactDemoChats", chatId, "messages"), {
        text,
        from: user.id,
        to: selectedUser.id,
        createdAt: serverTimestamp(),
      });
      setText("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // 🔹 Render loading state
  if (authLoading) return <div>Loading auth...</div>;
  if (!user) return <div>Please log in to start chatting</div>;

  return (
    <div style={{ display: "flex", height: "100%" }}>
      {/* Sidebar: user list */}
      <div
        style={{
          width: "250px",
          borderRight: "1px solid #ccc",
          padding: "10px",
        }}
      >
        <h3>Users</h3>
        {users.map((u) => (
          <div
            key={u.id}
            onClick={() => setSelectedUser(u)}
            style={{
              padding: "8px",
              margin: "5px 0",
              cursor: "pointer",
              background:
                selectedUser?.id === u.id ? "#ddd" : "transparent",
            }}
          >
            {u.email}
          </div>
        ))}
      </div>

      {/* Chat area */}
      <div style={{ flex: 1, padding: "10px" }}>
        {!selectedUser ? (
          <h3>Select a user to start chatting</h3>
        ) : (
          <>
            <h3>Chat with {selectedUser.email}</h3>

            <div
              style={{
                height: "400px",
                overflowY: "auto",
                border: "1px solid #ccc",
                padding: "10px",
                marginBottom: "10px",
              }}
            >
              {messages.map((msg) => (
                <p
                  key={msg.id}
                  style={{
                    textAlign: msg.from === user.id ? "right" : "left",
                    background: msg.from === user.id ? "#dcf8c6" : "#fff",
                    padding: "5px 10px",
                    borderRadius: "10px",
                    margin: "5px 0",
                  }}
                >
                  {msg.text}
                </p>
              ))}
              <span ref={dummy}></span>
            </div>

            <form
              style={{ display: "flex", gap: "10px" }}
              onSubmit={sendMessage}
            >
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type a message..."
                style={{ flex: 1, padding: "10px" }}
              />
              <button type="submit">Send</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
