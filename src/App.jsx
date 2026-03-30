import { useState, useEffect } from 'react';
import Keyboard from "./components/Keyboard";
import Display from "./components/Display";
import Toolbar from "./components/Toolbar"; // רכיב חדש שניצור
import './App.css';

function App() {
  const [text, setText] = useState("");
  const [history, setHistory] = useState([""]); // להיסטוריית Undo
  const [currentStyle, setCurrentStyle] = useState({
    color: "black",
    fontSize: "28px",
    fontFamily: "sans-serif"
  });

  // עדכון היסטוריה בכל שינוי טקסט (לצורך Undo)
  const updateText = (newText) => {
    setHistory(prev => [...prev, text]);
    setText(newText);
  };

  // פעולות עריכה מתקדמות
  const handleUndo = () => {
    if (history.length > 0) {
      const previous = history[history.length - 1];
      setHistory(prev => prev.slice(0, -1));
      setText(previous);
    }
  };

  const deleteWord = () => {
    const words = text.trimEnd().split(" ");
    words.pop();
    updateText(words.join(" "));
  };

  const findAndReplace = (toFind, toReplace) => {
    updateText(text.replaceAll(toFind, toReplace));
  };

  return (
    <div className="app-container">
      <h1>עורך טקסט ויזואלי</h1>

      {/* העברת הסגנון לרכיב התצוגה */}
      <Display text={text} style={currentStyle} />

      {/* סרגל כלים חדש לעיצוב ופעולות מתקדמות */}
      <Toolbar 
        currentStyle={currentStyle} 
        setStyle={setCurrentStyle} 
        onUndo={handleUndo}
        onDeleteWord={deleteWord}
        onClear={() => updateText("")}
        onReplace={findAndReplace}
      />

      <div className="controls">
        {/* כפתורי החלפת שפה כפי שהיו... */}
      </div>

      <Keyboard onKeyClick={(char) => updateText(text + char)} />
    </div>
  );
}