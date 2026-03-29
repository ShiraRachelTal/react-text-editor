import { useState } from 'react'
import './App.css'

// הגדרת המקלדות מחוץ לקומפוננטה
const KEYBOARDS = {
  hebrew: ["א", "ב", "ג", "ד", "ה", "ו", "ז", "ח", "ט", "י", "כ", "ל", "מ", "נ", "ס", "ע", "פ", "צ", "ק", "ר", "ש", "ת"],
  english: ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "A", "S", "D", "F", "G", "H", "J", "K", "L", "Z", "X", "C", "V", "B", "N", "M"],
  emoji: ["😀", "😂", "😍", "🚀", "🍕", "🎈", "✨", "🔥"]
};

function App() {
  const [text, setText] = useState("");
  const [lang, setLang] = useState("hebrew"); // State לשפה הנוכחית

  // פונקציות עריכה (דרישה של חלק א')
  const addChar = (char) => setText(prev => prev + char);
  const deleteLast = () => setText(prev => prev.slice(0, -1));
  const clearAll = () => {
    if(window.confirm("בטוח שרוצים למחוק הכל?")) setText("");
  };

  return (
    <div className="main-container">
      <header>
        <h1>עורך טקסט ויזואלי</h1>
      </header>

      {/* אזור הצגת הטקסט */}
      <section className="display-area">
        {text}
        <span className="cursor">|</span>
      </section>

      {/* אזור הבקרה - החלפת שפות */}
      <nav className="toolbar">
        <button onClick={() => setLang("hebrew")}>עברית</button>
        <button onClick={() => setLang("english")}>English</button>
        <button onClick={() => setLang("emoji")}>😊</button>
      </nav>

      {/* המקלדת הדינמית */}
      <section className="keyboard-container">
        <div className="keys-grid">
          {KEYBOARDS[lang].map(char => (
            <button key={char} onClick={() => addChar(char)} className="key">
              {char}
            </button>
          ))}
        </div>

        {/* לחיצים מיוחדים (מחיקת תו, רווח) */}
        <div className="special-keys">
          <button onClick={() => addChar(" ")} className="space-key">רווח</button>
          <button onClick={deleteLast} className="delete-key">Delete</button>
          <button onClick={clearAll} className="clear-key">מחק הכל</button>
        </div>
      </section>
    </div>
  )
}

export default App