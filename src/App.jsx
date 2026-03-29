import { useState } from 'react';
import Keyboard from "./components/Keyboard"; // ייבוא הרכיב החדש
import Display from "./components/Display";
import './App.css';

const KEYBOARDS = {
  hebrew: ["א", "ב", "ג", "ד", "ה", "ו", "ז", "ח", "ט", "י"],
  english: ["A", "B", "C", "D", "E", "F"],
  emoji: ["😀", "🚀", "🍕"]
};

function App() {
  const [text, setText] = useState("");
  const [lang, setLang] = useState("hebrew");

  const handleKeyClick = (char) => setText(prev => prev + char);

  return (
    <div className="app-container">
      <div className="display-screen">{text}</div>
      
      <div className="controls">
        <button onClick={() => setLang("hebrew")}>עברית</button>
        <button onClick={() => setLang("english")}>English</button>
      </div>

      {/* שימוש ברכיב המקלדת ושליחת המידע אליו ב-Props */}
      <Keyboard 
        activeLang={lang} 
        onKeyClick={handleKeyClick} 
        keyboardsData={KEYBOARDS} 
      />
    </div>
  );
}

export default App;