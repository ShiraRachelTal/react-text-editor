import React from 'react';

const Keyboard = ({ activeLang, onKeyClick, keyboardsData }) => {
  
  // מנגנון הגנה: אם הנתונים עדיין לא הגיעו, נחזיר "טוען" במקום לקרוס
  if (!keyboardsData || !keyboardsData[activeLang]) {
    return <div className="loading-msg">טוען מקלדת...</div>;
  }

  return (
    <div className="keyboard-grid">
      {keyboardsData[activeLang].map((char) => (
        <button 
          key={char} 
          className="key-button"
          onClick={() => onKeyClick(char)}
        >
          {char}
        </button>
      ))}
    </div>
  );
};

export default Keyboard;