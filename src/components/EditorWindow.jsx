import React from 'react';
import Display from './Display';

// הרכיב מקבל 4 Props:
// file = אובייקט שמכיל את פרטי הקובץ (שם, טקסט)
// isActive = משתנה בוליאני (true/false) שאומר אם החלון הזה הוא הפעיל כרגע
// onFocus = פונקציה שתופעל כשלוחצים על החלון כדי להפוך אותו לפעיל
// onClose = פונקציה שתופעל כשלוחצים על ה-X
const EditorWindow = ({ file, isActive, onFocus, onClose }) => {
  return (
    <div 
      // אם החלון פעיל, נוסיף לו מחלקה מיוחדת כדי שנוכל להאיר אותו בעיצוב
      className={`editor-window ${isActive ? 'active-window' : ''}`} 
      onClick={onFocus}
    >
      <div className="window-header">
        <span className="window-title">{file.name}</span>
        <button 
          className="close-window-btn"
          onClick={(e) => {
            e.stopPropagation(); // פקודה חשובה! מונעת מהלחיצה על ה-X להיחשב גם כלחיצה על החלון עצמו
            onClose(file.id);
          }}
          title="סגור חלון"
        >
          ✖️
        </button>
      </div>
      
      {/* כאן אנחנו קוראים לרכיב התצוגה הקיים שלנו, ומעבירים לו את הטקסט של הקובץ הספציפי הזה */}
      <Display text={file.text} />
    </div>
  );
};

export default EditorWindow;