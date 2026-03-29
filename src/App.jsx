import { useState } from 'react'
import './App.css'

function App() {
  // ה-State שישמור את הטקסט שהמשתמש מקליד מהמקלדת הוויזואלית
  const [text, setText] = useState("");

  // פונקציה להוספת תו (תשמש את המקלדת שנבנה בהמשך)
  const addChar = (char) => {
    setText(prev => prev + char);
  };

  return (
    <div className="main-container">
      <h1>עורך טקסט ויזואלי</h1>
      
      {/* חלק א' - אזור הצגת הטקסט (למעלה) */}
      <div className="display-area">
        {text || "הקלידו משהו במקלדת למטה..."}
      </div>

      <hr />

      {/* חלק א' - אזור המקלדת (למטה) */}
      <div className="keyboard-area">
        <h3>מקלדת עברית</h3>
        <div className="keys">
          {["א", "ב", "ג", "ד", "ה", "ו", "ז", "ח", "ט", "י"].map(char => (
            <button key={char} onClick={() => addChar(char)}>
              {char}
            </button>
          ))}
        </div>
        <button className="special-btn" onClick={() => setText("")}>מחיקת הכל</button>
      </div>
    </div>
  )
}

export default App