// src/components/ChatMessage.jsx
import React from 'react';

export default function ChatMessage({ message, currentUid }) {
  const { text, uid, photoURL, displayName, createdAt, imageURL } = message;
  const isMe = uid === currentUid;
  const time = createdAt?.toDate ? createdAt.toDate().toLocaleTimeString() : '';

  return (
    <div className={`message ${isMe ? 'sent' : 'received'}`}>
      <img src={photoURL || '/avatar.png'} alt={displayName || 'user'} className="avatar" />
      <div className="bubble">
        <div className="meta">
          <strong>{displayName || 'Anon'}</strong>
          <span className="time">{time}</span>
        </div>
        {imageURL && <img src={imageURL} alt="sent" className="sent-image" />}
        {text && <p>{text}</p>}
      </div>
    </div>
  );
}
