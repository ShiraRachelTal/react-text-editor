import React from 'react';

// רכיב המקלדת מקבל שתי "מתנות" (Props):
// 1. הוכחה איזו שפה להציג (activeLang)
// 2. פונקציה להפעלה כשלוחצים על מקש (onKeyClick)
const Keyboard = ({ activeLang, onKeyClick, keyboardsData }) => {
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