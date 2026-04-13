import React from 'react';
import './Display.css';

const Display = ({ text }) => {
  return (
    <div className="display-area">
      {text.length === 0 ? ( /* הצגת טקסט ברירת מחדל כאשר אין תוכן*/
        <span className="placeholder-text">Start typing...</span>
      ) : (
        text.map((item, index) => ( /* הצגת כל תו עם הסגנון שלו */
          <span 
            key={index}
            style={{
              color: item.color,
              fontSize: item.fontSize,
              fontFamily: item.fontFamily
            }}
          >
            {item.char} {/*הצגת התו עצמו */}
          </span>
        ))
      )}
      <span className="cursor">|</span> {/* סמן קבוע בסוף הטקסט */}
    </div>
  );
};

export default Display;