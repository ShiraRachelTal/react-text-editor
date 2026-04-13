import { useState } from 'react';
import Keyboard from "./components/Keyboard/Keyboard";
import EditorWindow from "./components/Editor/EditorWindow"; 
import DesignPanel from "./components/Panels/DesignPanel";
import ActionsPanel from "./components/Panels/ActionsPanel";
import { KEYBOARDS } from './constants/constants';
import { checkShouldCapitalize, calculateTextAfterWordDelete } from './utils/textUtils';
import { downloadAsTxt } from './utils/fileUtils';
import { getUserFilesList, saveToStorage, loadFromStorage, deleteFromStorage } from './utils/storageUtils';

import './App.css';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [openFiles, setOpenFiles] = useState([
    { id: 1, name: "New File", text: [], history: [] }
  ]);
  const [activeFileId, setActiveFileId] = useState(1);
  const [savedFilesList, setSavedFilesList] = useState([]);
  
  const [lang, setLang] = useState("hebrew");
  const [isShift, setIsShift] = useState(false); 
  
  const [currentStyle, setCurrentStyle] = useState({
    color: "#e0e0e0", 
    fontSize: "28px",
    fontFamily: "sans-serif"
  });

  const activeFile = openFiles.find(f => f.id === activeFileId);

  // שימוש ב-Utils במקום לולאות פנימיות
  const autoCap = checkShouldCapitalize(activeFile?.text);
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

  // שימוש ב-Utils למחיקת מילה
  const deleteWord = () => {
    if (!activeFile) return;
    const newText = calculateTextAfterWordDelete(activeFile.text);
    updateActiveFileText(newText);
  };

  const handleFindAndReplace = () => {
    if (!activeFile) return;
    const toFind = prompt("Find:");
    if (!toFind) return;
    const toReplace = prompt("Replace:");
    if (toReplace === null) return;
    updateActiveFileText(activeFile.text.map(item => item.char === toFind ? {...item, char: toReplace} : item));
  };

  const handleClearAll = () => updateActiveFileText([]);

  // פונקציית שמירה נקייה יותר
  const saveFile = (fileToSave = activeFile) => {
    if (!fileToSave || !currentUser) {
      alert("You must be logged in to save files!");
      return false;
    }
    let fileName = fileToSave.name;
    if (fileName === "New File") {
      const userInput = prompt("Enter file name:");
      if (userInput === null) return false; 
      fileName = userInput.trim() === "" ? "Untitled" : userInput;
      setOpenFiles(prev => prev.map(f => f.id === fileToSave.id ? {...f, name: fileName} : f));
    }
    
    // שימוש ב-Utils
    saveToStorage(currentUser, fileName, fileToSave.text);
    setSavedFilesList(getUserFilesList(currentUser));
    
    alert(`File "${fileName}" saved successfully for user ${currentUser}!`);
    return true; 
  };

  // טעינה מקוצרת
  const loadFile = (fileName) => {
    const data = loadFromStorage(currentUser, fileName);
    if (data) {
      const id = Date.now();
      setOpenFiles([...openFiles, { id, name: fileName, text: data, history: [] }]);
      setActiveFileId(id);
    }
  };

  // מחיקה מקוצרת
  const handleDeleteFile = () => {
    if (!activeFile || !currentUser) return;
    const isSaved = loadFromStorage(currentUser, activeFile.name);
    
    if (!isSaved) {
      alert("This file isn't saved in your account.");
      return;
    }
    if (window.confirm(`Are you sure you want to delete "${activeFile.name}"?`)) {
      deleteFromStorage(currentUser, activeFile.name); 
      setSavedFilesList(getUserFilesList(currentUser)); 
      setOpenFiles(prev => prev.filter(f => f.id !== activeFileId)); 
      alert("File deleted successfully!");
    }
  };

  const handleCloseWindow = (id) => {
    const fileToClose = openFiles.find(f => f.id === id);
    if (!fileToClose) return;
    if (fileToClose.text.length > 0) {
      if (window.confirm(`Do you want to save changes to "${fileToClose.name}"?`)) {
        if (!saveFile(fileToClose)) return;
      }
    }
    setOpenFiles(openFiles.filter(f => f.id !== id));
  };

  // הורדה שמנוהלת מבחוץ
  const handleDownloadFile = () => {
    if (!activeFile || activeFile.text.length === 0) return;
    downloadAsTxt(activeFile.name, activeFile.text);
  };

  const applyStyleToAll = () => {
    if(activeFile) updateActiveFileText(activeFile.text.map(item => ({...item, ...currentStyle})));
  };

  // לוגין שמשתמש ב-Utils
  const handleLogin = () => {
    const name = prompt("הזן שם משתמש:");
    if (name && name.trim() !== "") {
      const userName = name.trim();
      setCurrentUser(userName);
      setSavedFilesList(getUserFilesList(userName)); 
    }
  };

  return (
    <div className="app-container">
      {!currentUser ? (
        <div style={{textAlign: 'center', marginTop: '50px'}}>
          <h1>Welcome to Multi-User Editor</h1>
          <button onClick={handleLogin} style={{padding: '15px 30px', fontSize: '1.2rem'}}>Login / Start</button>
        </div>
      ) : (
        <>
          <div className="user-bar" style={{width: '100%', maxWidth: '1200px', display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#00ffcc'}}>
            <span>User: <strong>{currentUser}</strong></span>
            <button onClick={() => {setCurrentUser(null); setOpenFiles([]);}}>Logout</button>
          </div>

          <div className="file-header">
            <h1>File Management</h1>
            <div className="file-actions">
              <button onClick={() => setOpenFiles([...openFiles, { id: Date.now(), name: "New File", text: [], history: [] }])}>New Window 📄</button>
              <button onClick={() => saveFile(activeFile)} disabled={!activeFile}>Save 💾</button>
              <button onClick={handleDeleteFile} disabled={!activeFile}>Delete 🗑️</button>
              <button onClick={handleDownloadFile} disabled={!activeFile}>Download TXT ⬇️</button>
              <select className="file-select" onChange={(e) => { loadFile(e.target.value); e.target.value = ""; }} defaultValue="">
                <option value="" disabled>Open existing file</option>
                {savedFilesList.map(name => <option key={name} value={name}>{name}</option>)}
              </select>
            </div>
          </div>

          <div className="windows-container">
            {openFiles.length === 0 ? (
              <p>No open windows.</p>
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
            <DesignPanel currentStyle={currentStyle} setCurrentStyle={setCurrentStyle} applyToAll={applyStyleToAll} />
            <div className="center-panel">
              <div className="controls">
                {["english", "emoji", "symbols", "hebrew"].map(l => (
                  <button key={l} onClick={() => setLang(l)} className={lang === l ? "active-lang" : ""}>
                    {l === "hebrew" ? "עברית" : l === "english" ? "English" : l === "emoji" ? "😊" : "#?!"}
                  </button>
                ))}
              </div>
              <Keyboard activeLang={lang} onKeyClick={handleKeyClick} keyboardsData={dynamicKeyboards} />
              <div className="special-actions">
                <button onClick={() => handleKeyClick(",")} className="symbol-key">,</button>
                <button onClick={() => handleKeyClick(" ")} className="space-btn">Space</button>
                <button onClick={() => activeFile && updateActiveFileText(activeFile.text.slice(0, -1))} className="delete-btn">Delete</button>
                <button onClick={() => handleKeyClick(".")} className="symbol-key">.</button>
              </div>
            </div>
            <ActionsPanel onUndo={handleUndo} onDeleteWord={deleteWord} onFindAndReplace={handleFindAndReplace} onClearAll={handleClearAll} />
          </div>
        </>
      )}
    </div>
  );
}

export default App;