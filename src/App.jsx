import { useState } from 'react';
import Keyboard from "./components/Keyboard";
import EditorWindow from "./components/EditorWindow"; 
import DesignPanel from "./components/DesignPanel";
import ActionsPanel from "./components/ActionsPanel";
import { KEYBOARDS } from './constants';
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

  const handleClearAll = () => updateActiveFileText([]);

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
    const storageKey = `${currentUser}_${fileName}`;
    localStorage.setItem(storageKey, JSON.stringify(fileToSave.text));
    const userFiles = Object.keys(localStorage).filter(key => key.startsWith(`${currentUser}_`));
    setSavedFilesList(userFiles.map(key => key.replace(`${currentUser}_`, "")));
    alert(`File "${fileName}" saved successfully for user ${currentUser}!`);
    return true; 
  };

  const loadFile = (fileName) => {
    const storageKey = `${currentUser}_${fileName}`;
    const data = localStorage.getItem(storageKey);
    if (data) {
      const id = Date.now();
      setOpenFiles([...openFiles, { id, name: fileName, text: JSON.parse(data), history: [] }]);
      setActiveFileId(id);
    }
  };

  const handleDeleteFile = () => {
    if (!activeFile || !currentUser) return;
    const storageKey = `${currentUser}_${activeFile.name}`;
    const isSaved = localStorage.getItem(storageKey);
    if (!isSaved) {
      alert("This file isn't saved in your account.");
      return;
    }
    if (window.confirm(`Are you sure you want to delete "${activeFile.name}"?`)) {
      localStorage.removeItem(storageKey); 
      const userFiles = Object.keys(localStorage).filter(key => key.startsWith(`${currentUser}_`));
      setSavedFilesList(userFiles.map(key => key.replace(`${currentUser}_`, ""))); 
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

  const handleDownloadFile = () => {
    if (!activeFile || activeFile.text.length === 0) return;
    const plainText = activeFile.text.map(item => item.char).join('');
    const blob = new Blob([plainText], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${activeFile.name}.txt`;
    link.click();
  };

  const applyStyleToAll = () => {
    if(activeFile) updateActiveFileText(activeFile.text.map(item => ({...item, ...currentStyle})));
  };

  const handleLogin = () => {
    const name = prompt("הזן שם משתמש:");
    if (name && name.trim() !== "") {
      const userName = name.trim();
      setCurrentUser(userName);
      const userFiles = Object.keys(localStorage).filter(key => key.startsWith(`${userName}_`));
      setSavedFilesList(userFiles.map(key => key.replace(`${userName}_`, ""))); 
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