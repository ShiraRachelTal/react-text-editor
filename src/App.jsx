import { useState } from 'react';
import Keyboard from "./components/Keyboard";
import Display from "./components/Display";
import Toolbar from "./components/Toolbar";
import './App.css';

const KEYBOARDS = {
  hebrew: ["א", "ב", "ג", "ד", "ה", "ו", "ז", "ח", "ט", "י", "כ", "ל", "מ", "נ", "ס", "ע", "פ", "צ", "ק", "ר", "ש", "ת", "ך", "ם", "ן", "ף", "ץ"],
  english: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
  emoji: ["😀", "😂", "😍", "🚀", "🍕", "🎈", "✨", "🔥", "🌈", "🎸"],
  symbols: ["!", "?", ".", ",", "(", ")", "@", "#", "$", "%"]
};

function App() {
  const [text, setText] = useState("");
  const [lang, setLang] = useState("hebrew");
  const [history, setHistory] = useState([]); 
  const [currentStyle, setCurrentStyle] = useState({
    color: "#333333",
    fontSize: "28px",
    fontFamily: "sans-serif"
  });

  // עדכון טקסט עם שמירה להיסטוריה (עבור Undo)
  const updateText = (newText) => {
    setHistory(prev => [...prev, text]);
    setText(newText);
  };

  const handleUndo = () => {
    if (history.length > 0) {
      const lastVersion = history[history.length - 1];
      setHistory(prev => prev.slice(0, -1));
      setText(lastVersion);
    }
  };

  const deleteWord = () => {
    const words = text.trimEnd().split(/\s+/);
    words.pop();
    updateText(words.length > 0 ? words.join(" ") + " " : "");
  };

  const findAndReplace = () => {
    const toFind = prompt("מה לחפש?");
    if (!toFind) return;
    const toReplace = prompt(`במה להחליף את "${toFind}"?`);
    if (toReplace === null) return;
    updateText(text.replaceAll(toFind, toReplace));
  };

  return (
    <div className="app-container">
      <h1>עורך טקסט מודולרי</h1>

      <Display text={text} style={currentStyle} />

      <Toolbar 
        setStyle={setCurrentStyle} 
        onUndo={handleUndo} 
        onDeleteWord={deleteWord}
        onReplace={findAndReplace}
        onClear={() => updateText("")}
      />

      <div className="controls">
        <button onClick={() => setLang("hebrew")}>עברית</button>
        <button onClick={() => setLang("english")}>English</button>
        <button onClick={() => setLang("emoji")}>😊</button>
        <button onClick={() => setLang("symbols")}>#?!</button>
      </div>

      <Keyboard 
        activeLang={lang} 
        onKeyClick={(char) => updateText(text + char)} 
        keyboardsData={KEYBOARDS} 
      />

      <div className="special-actions">
        <button onClick={() => updateText(text + " ")} className="space-btn">רווח</button>
        <button onClick={() => updateText(text.slice(0, -1))} className="delete-btn">מחיקת תו</button>
      </div>
    </div>
  );
}

export default App;