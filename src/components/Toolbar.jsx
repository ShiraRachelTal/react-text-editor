import React from 'react';

const Toolbar = ({ currentStyle, setStyle, onUndo, onDeleteWord, onClear, onReplace }) => {
  return (
    <div className="toolbar-container">
      {/* בחירת צבעים */}
      <div className="tool-group">
        <span>צבע:</span>
        <button onClick={() => setStyle({...currentStyle, color: "red"})} style={{color: "red"}}>A</button>
        <button onClick={() => setStyle({...currentStyle, color: "blue"})} style={{color: "blue"}}>A</button>
        <button onClick={() => setStyle({...currentStyle, color: "green"})} style={{color: "green"}}>A</button>
      </div>

      {/* בחירת גודל גופן */}
      <div className="tool-group">
        <span>גודל:</span>
        <select onChange={(e) => setStyle({...currentStyle, fontSize: e.target.value})}>
          <option value="20px">קטן</option>
          <option value="28px">בינוני</option>
          <option value="40px">גדול</option>
        </select>
      </div>

      {/* פעולות מתקדמות */}
      <div className="tool-group">
        <button onClick={onUndo}>Undo ↩️</button>
        <button onClick={onDeleteWord}>מחק מילה 🔙</button>
        <button onClick={() => {
          const find = prompt("חפש תו:");
          const replace = prompt("החלף ב:");
          if(find && replace) onReplace(find, replace);
        }}>חפש והחלף 🔍</button>
      </div>
    </div>
  );
};

export default Toolbar;