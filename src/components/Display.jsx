import React from 'react';
export default Display;

const Display = ({ text, style }) => {
  return (
    <div className="display-area" style={{ 
      color: style.color, 
      fontSize: style.fontSize, 
      fontFamily: style.fontFamily 
    }}>
      {text || "התחילי להקליד..."}
      <span className="cursor">|</span>
    </div>
  );
};