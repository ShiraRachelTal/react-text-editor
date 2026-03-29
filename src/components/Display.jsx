import React from 'react';

// הרכיב מקבל את הטקסט להצגה (text) ואת הצבע הנוכחי (color)
const Display = ({ text, color = "black" }) => {
  return (
    <div className="display-area" style={{ color: color }}>
      {text || "הקלידו משהו במקלדת..."}
      <span className="cursor">|</span>
    </div>
  );
};

export default Display;