import React from 'react';

const Toolbar = ({ currentStyle, setStyle, onUndo, onDeleteWord, onClear, onReplace }) => {
  return (
    <div className="toolbar-container">
      {/* בחירת צבעים - שינוי מכאן והלאה */}
      <div className="tool-group">
        <button onClick={() => setStyle({...currentStyle, color: "red"})} style={{color: "red"}}>אדום</button>
        <button onClick={() => setStyle({...currentStyle, color: "blue"})} style={{color: "blue"}}>כחול</button>
        <button onClick={() => setStyle({...currentStyle, color: "black"})}>שחור</button>
      </div>

      {/* פעולות מתקדמות */}
      <div className="tool-group">
        <button onClick={onUndo} title="ביטול פעולה אחרונה">Undo ↩️</button>
        <button onClick={onDeleteWord}>מחק מילה 🔙</button>
        <button onClick={() => {
          const f = prompt("חפש תו:");
          const r = prompt("החלף ב:");
          if(f !== null && r !== null) onReplace(f, r);
        }}>חפש והחלף 🔍</button>
        <button onClick={onClear} className="clear-btn">נקה הכל</button>
      </div>
    </div>
  );
};

export default Toolbar;