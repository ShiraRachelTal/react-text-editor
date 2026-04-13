import React from 'react';
import './Keyboard.css';

const Keyboard = ({ activeLang, onKeyClick, keyboardsData }) => {
  if (!keyboardsData || !keyboardsData[activeLang]) {
    return <div className="loading-msg">טוען מקלדת...</div>;
  }

  return (
    <div className={`keyboard-container ${activeLang === 'english' ? 'ltr-keyboard' : 'rtl-keyboard'}`}>
      {keyboardsData[activeLang].map((row, rowIndex) => (
        <div key={rowIndex} className="keyboard-row">
          {row.map((char) => (
            <button 
              key={char} 
              className="key-button"
              onClick={() => onKeyClick(char)}
            >
              {char}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;