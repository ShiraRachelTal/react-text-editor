import { useState } from 'react';
import Keyboard from "./components/Keyboard";
import Display from "./components/Display";
import './App.css';

const KEYBOARDS = {
  hebrew: ["א", "ב", "ג", "ד", "ה", "ו", "ז", "ח", "ט", "י", "כ", "ל", "מ", "נ", "ס", "ע", "פ", "צ", "ק", "ר", "ש", "ת", "ך", "ם", "ן", "ף", "ץ"],
  english: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
  symbols: ["!", "?", ".", ",", "(", ")", "@", "#", "$", "%", "&", "-", "+", "=", "/"],
  emoji: ["😀", "😂", "😍", "🚀", "🍕", "🎈", "✨", "🔥", "🌈", "🎸"] // החזרנו אותם!
};

function App() {
  const [text, setText] = useState("");
  const [lang, setLang] = useState("hebrew");

  const handleKeyClick = (char) => setText(prev => prev + char);
  
  const deleteLastChar = () => {
    setText(prev => prev.slice(0, -1));
  };

  return (
    <div className="app-container">
      <h1>עורך טקסט ויזואלי</h1>
      
      <Display text={text} />
      
      <div className="controls">
        <button onClick={() => setLang("hebrew")}>עברית</button>
        <button onClick={() => setLang("english")}>English</button>
        <button onClick={() => setLang("symbols")}>#?!</button>
        <button onClick={() => setLang("emoji")}>😊</button> 
      </div>

      {/* המקלדת מקבלת את הכיווניות לפי השפה */}
      <div className={lang === "hebrew" ? "rtl-keyboard" : "ltr-keyboard"}>
        <Keyboard 
          activeLang={lang} 
          onKeyClick={handleKeyClick} 
          keyboardsData={KEYBOARDS} 
        />
      </div>

      <div className="special-actions">
        <button onClick={() => handleKeyClick(" ")} className="space-btn">רווח</button>
        <button onClick={deleteLastChar} className="delete-btn">מחיקת תו</button>
        <button onClick={() => setText("")} className="clear-btn">נקה הכל</button>
      </div>
    </div>
  );
}

export default App;