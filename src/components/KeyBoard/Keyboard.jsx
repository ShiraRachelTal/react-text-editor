import React from 'react';
import './Keyboard.css';

const Keyboard = ({ activeLang, onKeyClick, keyboardsData }) => {
  if (!keyboardsData || !keyboardsData[activeLang]) { // בדיקה אם הנתונים קיימים לפני הניסיון לגשת אליהם
    return <div className="loading-msg">טוען מקלדת...</div>;
  }

  return (
    <div className={`keyboard-container ${activeLang === 'english' ? 'ltr-keyboard' : 'rtl-keyboard'}`}>
      {keyboardsData[activeLang].map((row, rowIndex) => ( // מעבר על כל שורה במקלדת ויצירת כפתורים לכל תו
        <div key={rowIndex} className="keyboard-row"> 
          {row.map((char) => ( 
            <button 
              key={char} //שימוש בתו כמפתח
              className="key-button"
              onClick={() => onKeyClick(char)} // קריאה לפונקציה שמטפלת בלחיצת כפתור עם התו שנלחץ
            >
              {char} {/* הצגת התו על הכפתור */}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;