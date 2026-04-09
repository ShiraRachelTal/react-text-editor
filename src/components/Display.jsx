import React from 'react';
import './Display.css';

const Display = ({ text }) => {
  return (
    <div className="display-area">
      {text.length === 0 ? (
        <span className="placeholder-text">Start typing...</span>
      ) : (
        text.map((item, index) => (
          <span 
            key={index} 
            style={{
              color: item.color,
              fontSize: item.fontSize,
              fontFamily: item.fontFamily
            }}
          >
            {item.char}
          </span>
        ))
      )}
      <span className="cursor">|</span>
    </div>
  );
};

export default Display;