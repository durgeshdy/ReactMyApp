// src/components/MessageInput.jsx
import React, { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';

export default function MessageInput({ user }) {
  const [formValue, setFormValue] = useState('');
  const [file, setFile] = useState(null);
  const sending = async (e) => {
    e.preventDefault();
    if (!formValue.trim() && !file) return;

    let imageURL = null;
    if (file) {
      const path = `chat_images/${user.uid}/${Date.now()}_${file.name}`;
      const ref = storageRef(storage, path);
      const snap = await uploadBytesResumable(ref, file);
      imageURL = await getDownloadURL(ref);
    }

    await addDoc(collection(db, 'messages'), {
      text: formValue || '',
      imageURL: imageURL || null,
      createdAt: serverTimestamp(),
      uid: user.uid,
      displayName: user.displayName || 'Anon',
      photoURL: user.photoURL || null,
    });

    setFormValue('');
    setFile(null);
  };

  return (
    <form onSubmit={sending} className="msg-form">
      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="Say something..." />
      <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
      <button type="submit" disabled={!formValue.trim() && !file}>Send</button>
    </form>
  );
}
