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

  const saveFile = (fileToSave = activeFile) => {
    if (!fileToSave) return false;
    let name = fileToSave.name;
    
    if (name === "New File") {
      const userInput = prompt("Enter file name:");
      if (userInput === null) return false; 
      name = userInput.trim() === "" ? "Untitled" : userInput;
      setOpenFiles(prev => prev.map(f => f.id === fileToSave.id ? {...f, name} : f));
    }
    
    localStorage.setItem(name, JSON.stringify(fileToSave.text));
    setSavedFilesList(Object.keys(localStorage));
    alert("Saved!");
    return true; 
  };

  const loadFile = (name) => {
    const data = localStorage.getItem(name);
    if (data) {
      const id = Date.now();
      setOpenFiles([...openFiles, { id, name, text: JSON.parse(data), history: [] }]);
      setActiveFileId(id);
    }
  };

  // --- פונקציית המחיקה החדשה והחכמה ---
  const handleDeleteFile = () => {
    if (!activeFile) return;

    const isSaved = localStorage.getItem(activeFile.name);

    if (!isSaved) {
      alert("This file hasn't been saved yet. You can just close the window.");
      return;
    }

    const confirmDelete = window.confirm(`Are you sure you want to permanently delete "${activeFile.name}"?`);
    
    if (confirmDelete) {
      localStorage.removeItem(activeFile.name); 
      setSavedFilesList(Object.keys(localStorage)); 
      setOpenFiles(prev => prev.filter(f => f.id !== activeFileId)); 
      alert("File deleted successfully!");
    }
  };

  const handleCloseWindow = (id) => {
    const fileToClose = openFiles.find(f => f.id === id);
    if (!fileToClose) return;

    if (fileToClose.text.length > 0) {
      const wantsToSave = window.confirm(`Do you want to save changes to "${fileToClose.name}" before closing?`);
      
      if (wantsToSave) {
        const isSaved = saveFile(fileToClose);
        if (!isSaved) {
          const closeAnyway = window.confirm("Save cancelled. Are you sure you want to close without saving?");
          if (!closeAnyway) {
            return; 
          }
        }
      }
    }
    setOpenFiles(openFiles.filter(f => f.id !== id));
  };

  const handleDownloadFile = () => {
    if (!activeFile || activeFile.text.length === 0) {
      alert("The file is empty.");
      return;
    }
    const plainText = activeFile.text.map(item => item.char).join('');
    const blob = new Blob([plainText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeFile.name === "New File" ? "Untitled" : activeFile.name}.txt`;
    link.click();
    URL.revokeObjectURL(url);
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
          <button onClick={() => saveFile(activeFile)} disabled={!activeFile}>Save 💾</button>
          
          {/* הנה כפתור המחיקה שנוסף! */}
          <button onClick={handleDeleteFile} disabled={!activeFile} className="delete-file-btn">Delete 🗑️</button>
          
          <button onClick={handleDownloadFile} disabled={!activeFile} className="download-btn">Download TXT ⬇️</button>
          
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
              onClose={() => handleCloseWindow(file.id)}
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