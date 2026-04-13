import React from 'react';
import Display from './Display';

const EditorWindow = ({ file, isActive, onFocus, onClose }) => {
  return (
    <div 
      className={`editor-window ${isActive ? 'active-window' : ''}`} /* הוספת המשך לשם מחלקה לחלון הפעיל */
      onClick={onFocus} /* הוספת מאזין לאירוע לחיצה כדי להגדיר את החלון כפעיל */
    >
      <div className="window-header">
        <span className="window-title">{file.name}</span> {/* שם הקובץ */}
        <button /* כפתור איקס לסגירת החלון */
          className="close-window-btn"
          onClick={(e) => {
            e.stopPropagation(); /* עצירת התפשטות האירוע כדי למנוע הפיכת החלון לפעיל לפני הסגירה */
            onClose();
          }}
          title="Close Window"
        >
          ✖️
        </button>
      </div>
      
      <Display text={file.text} /> {/* שליחת הטסט למחלקה display שמציגה אותו */}
    </div>
  );
};

export default EditorWindow;