import { useState } from 'react';
import Keyboard from "./components/Keyboard";
import EditorWindow from "./components/EditorWindow"; 
import DesignPanel from "./components/DesignPanel";
import ActionsPanel from "./components/ActionsPanel";
import { KEYBOARDS } from './constants';
import './App.css';

function App() {
  const [openFiles, setOpenFiles] = useState([
    { id: 1, name: "New File", text: [], history: [] }
  ]);
  const [activeFileId, setActiveFileId] = useState(1);
  const [savedFilesList, setSavedFilesList] = useState(Object.keys(localStorage));
  
  const [lang, setLang] = useState("hebrew");
  const [isShift, setIsShift] = useState(false); 
  
  const [currentStyle, setCurrentStyle] = useState({
    color: "#e0e0e0", 
    fontSize: "28px",
    fontFamily: "sans-serif"
  });

  const activeFile = openFiles.find(f => f.id === activeFileId);

  const checkShouldCapitalize = () => {
    if (!activeFile || activeFile.text.length === 0) return true;
    let lastChar = null;
    for (let i = activeFile.text.length - 1; i >= 0; i--) {
      if (activeFile.text[i].char !== ' ' && activeFile.text[i].char !== '\n') {
        lastChar = activeFile.text[i].char;
        break;
      }
    }
    if (lastChar === null) return true; 
    return ['.', '!', '?'].includes(lastChar);
  };

  const autoCap = checkShouldCapitalize();
  const isUpperCase = isShift ? !autoCap : autoCap;

  const dynamicKeyboards = { ...KEYBOARDS };
  if (lang === "english") {
    dynamicKeyboards.english = KEYBOARDS.english.map(row => 
      row.map(char => char.match(/[A-Z]/) ? (isUpperCase ? char : char.toLowerCase()) : char)
    );
    dynamicKeyboards.english[3] = [...dynamicKeyboards.english[3], isShift ? "SHIFT" : "Shift"];
  }

  const updateActiveFileText = (newTextArray) => {
    if (!activeFile) return;
    setOpenFiles(prevFiles => prevFiles.map(file => {
      if (file.id === activeFileId) {
        return { ...file, history: [...file.history, file.text], text: newTextArray };
      }
      return file;
    }));
  };

  const handleKeyClick = (char) => {
    if (!activeFile) return;

    if (char === "Shift" || char === "SHIFT") {
      setIsShift(!isShift);
      return; 
    }

    const newCharObject = {
      char: char,
      color: currentStyle.color,
      fontSize: currentStyle.fontSize,
      fontFamily: currentStyle.fontFamily
    };
    updateActiveFileText([...activeFile.text, newCharObject]);
    
    if (isShift) setIsShift(false);
  };

  const handleUndo = () => {
    if (!activeFile || activeFile.history.length === 0) return;
    setOpenFiles(prevFiles => prevFiles.map(file => {
      if (file.id === activeFileId) {
        const previousText = file.history[file.history.length - 1];
        return { ...file, text: previousText, history: file.history.slice(0, -1) };
      }
      return file;
    }));
  };

  const deleteWord = () => {
    if (!activeFile) return;
    let lastSpaceIndex = -1;
    for (let i = activeFile.text.length - 1; i >= 0; i--) {
      if (activeFile.text[i].char === " ") { lastSpaceIndex = i; break; }
    }
    updateActiveFileText(lastSpaceIndex !== -1 ? activeFile.text.slice(0, lastSpaceIndex + 1) : []);
  };

  const handleFindAndReplace = () => {
    if (!activeFile) return;
    const toFind = prompt("Find:");
    if (!toFind) return;
    const toReplace = prompt("Replace:");
    if (toReplace === null) return;
    updateActiveFileText(activeFile.text.map(item => item.char === toFind ? {...item, char: toReplace} : item));
  };

  const handleClearAll = () => {
    updateActiveFileText([]);
  };

  const saveFile = () => {
    if (!activeFile) return;
    let name = activeFile.name;
    if (name === "New File") {
      name = prompt("Enter file name:") || "Untitled";
      setOpenFiles(prev => prev.map(f => f.id === activeFileId ? {...f, name} : f));
    }
    localStorage.setItem(name, JSON.stringify(activeFile.text));
    setSavedFilesList(Object.keys(localStorage));
    alert("Saved!");
  };

  const loadFile = (name) => {
    const data = localStorage.getItem(name);
    if (data) {
      const id = Date.now();
      setOpenFiles([...openFiles, { id, name, text: JSON.parse(data), history: [] }]);
      setActiveFileId(id);
    }
  };

  const applyStyleToAll = () => {
      if(activeFile) updateActiveFileText(activeFile.text.map(item => ({...item, ...currentStyle})));
  }

  return (
    <div className="app-container">
      <div className="file-header">
        <h1>File Management</h1>
        <div className="file-actions">
          <button onClick={() => setOpenFiles([...openFiles, { id: Date.now(), name: "New File", text: [], history: [] }])}>New Window 📄</button>
          <button onClick={saveFile} disabled={!activeFile}>Save 💾</button>
          <select className="file-select" onChange={(e) => { loadFile(e.target.value); e.target.value = ""; }} defaultValue="">
            <option value="" disabled>Open existing file</option>
            {savedFilesList.map(name => <option key={name} value={name}>{name}</option>)}
          </select>
        </div>
      </div>

      <div className="windows-container">
        {openFiles.length === 0 ? (
          <p className="no-files-msg">No open windows. Click "New Window" to start.</p>
        ) : (
          openFiles.map(file => (
            <EditorWindow 
              key={file.id}
              file={file}
              isActive={file.id === activeFileId}
              onFocus={() => setActiveFileId(file.id)}
              onClose={(id) => setOpenFiles(openFiles.filter(f => f.id !== id))}
            />
          ))
        )}
      </div>

      <div className="bottom-workspace">
        <DesignPanel 
           currentStyle={currentStyle} 
           setCurrentStyle={setCurrentStyle} 
           applyToAll={applyStyleToAll} 
        />

        <div className="center-panel">
          <div className="controls">
            {["english", "emoji", "symbols", "hebrew"].map(l => (
              <button key={l} onClick={() => setLang(l)} className={lang === l ? "active-lang" : ""}>
                {l === "hebrew" ? "עברית" : l === "english" ? "English" : l === "emoji" ? "😊" : "#?!"}
              </button>
            ))}
          </div>
          
          <Keyboard 
            activeLang={lang} 
            onKeyClick={handleKeyClick} 
            keyboardsData={dynamicKeyboards} 
            className={lang === "emoji" || lang === "symbols" ? "grid-style" : lang === "english" ? "ltr-keyboard" : "rtl-keyboard"} 
          />
          
          <div className="special-actions">
            <button onClick={() => handleKeyClick(",")} className="symbol-key">,</button>
            <button onClick={() => handleKeyClick(" ")} className="space-btn">Space</button>
            <button onClick={() => activeFile && updateActiveFileText(activeFile.text.slice(0, -1))} className="delete-btn">Delete</button>
            <button onClick={() => handleKeyClick(".")} className="symbol-key">.</button>
          </div>
        </div>

        <ActionsPanel 
          onUndo={handleUndo} 
          onDeleteWord={deleteWord} 
          onFindAndReplace={handleFindAndReplace} 
          onClearAll={handleClearAll} 
        />
      </div>
    </div>
  );
}

export default App;