import React from 'react';

const Display = ({ text, style }) => {
  return (
    <div className="display-area" style={{ 
      color: style?.color || "black", 
      fontSize: style?.fontSize || "28px",
      fontFamily: style?.fontFamily || "sans-serif"
    }}>
      {text || "התחילי להקליד..."}
      <span className="cursor">|</span>
    </div>
  );
};

export default Display;