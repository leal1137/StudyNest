import React from 'react';
import '../App.css'; 

export function CustomButton({ text, caption, onClick }) {
  return (
    <div className="button-container">
      <button className="black-button" onClick={onClick}>
        {text}
      </button>
      {caption && <div className="button-caption">{caption}</div>}
    </div>
  );
}