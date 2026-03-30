import React from 'react';

// ודאי שיש כאן סוגריים מסולסלים { } סביב text ו-style
const Display = ({ text, style }) => {
  return (
    <div className="display-area" style={{ 
      color: style?.color || "black", 
      fontSize: style?.fontSize || "28px" 
    }}>
      {text || "התחילי להקליד..."}
    </div>
  );
};

export default Display;