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
  const [currentUser, setCurrentUser] = useState(null); // שמירת שם המשתמש הנוכחי
  const [openFiles, setOpenFiles] = useState([ // פתיחת חלון חדש כברירת מחדל עם מזהה ייחודי, שם "New File", טקסט ריק והיסטוריה ריקה
    { id: 1, name: "New File", text: [], history: [] }
  ]);
  const [activeFileId, setActiveFileId] = useState(1); // מזהה החלון הפעיל כברירת מחדל הוא הראשון שפתחנו
  const [savedFilesList, setSavedFilesList] = useState([]); // רשימת הקבצים השמורים של המשתמש הנוכחי
  
  const [lang, setLang] = useState("hebrew"); // שפת המקלדת הנוכחית, ברירת מחדל לעברית
  const [isShift, setIsShift] = useState(false); // מצב Shift, משפיע על האותיות באנגלית בלבד
  
  const [currentStyle, setCurrentStyle] = useState({ // סגנון ברירת מחדל לכל התווים החדשים שייכתבו
    color: "#e0e0e0", 
    fontSize: "28px",
    fontFamily: "sans-serif"
  });

  const activeFile = openFiles.find(f => f.id === activeFileId); // קבלת האובייקט של החלון הפעיל על פי המזהה שלו

  const autoCap = checkShouldCapitalize(activeFile?.text); // בדיקה האם יש צורך להגדיל את האות הראשונה של המילה הבאה על פי התו האחרון במערך הטקסט של החלון הפעיל
  const isUpperCase = isShift ? !autoCap : autoCap;

  const dynamicKeyboards = { ...KEYBOARDS }; // יצירת עותק של המערך המקורי כדי לא לשנות אותו ישירות
  if (lang === "english") { 
    dynamicKeyboards.english = KEYBOARDS.english.map(row => 
      row.map(char => char.match(/[A-Z]/) ? (isUpperCase ? char : char.toLowerCase()) : char) 
    );
    dynamicKeyboards.english[3] = [...dynamicKeyboards.english[3], isShift ? "SHIFT" : "Shift"];
  }

  // פונקציה לעדכון הטקסט של החלון הפעיל, מוסיפה את הטקסט החדש להיסטוריה לפני העדכון
  const updateActiveFileText = (newTextArray) => {
    if (!activeFile) return;
    setOpenFiles(prevFiles => prevFiles.map(file => {
      if (file.id === activeFileId) {
        return { ...file, history: [...file.history, file.text], text: newTextArray }; // לפני העדכון של הטקסט, מוסיפים את הטקסט הנוכחי להיסטוריה של החלון כדי לאפשר פעולת Undo בעתיד
      }
      return file;
    }));
  };

  //
  const handleKeyClick = (char) => {
    if (!activeFile) return;
    if (char === "Shift" || char === "SHIFT") { // לחיצה על כפתור Shift משנה את מצב ה-Shift הנוכחי
      setIsShift(!isShift);
      return; 
    }
    const newCharObject = { // יצירת אובייקט חדש לכל תו שמכיל את התו עצמו ואת הסגנון הנוכחי
      char: char,
      color: currentStyle.color,
      fontSize: currentStyle.fontSize,
      fontFamily: currentStyle.fontFamily
    };
    updateActiveFileText([...activeFile.text, newCharObject]); // הוספת התו החדש למערך הטקסט של החלון הפעיל
    if (isShift) setIsShift(false);
  };

  // פונקציה ל-Undo שמחזירה את הטקסט למצב הקודם על ידי לקיחת הטקסט האחרון מההיסטוריה של החלון הפעיל
  const handleUndo = () => {
    if (!activeFile || activeFile.history.length === 0) return;
    setOpenFiles(prevFiles => prevFiles.map(file => {
      if (file.id === activeFileId) { // אם זה החלון הפעיל, מחזירים את הטקסט למצב הקודם על ידי לקיחת הטקסט האחרון מההיסטוריה
        const previousText = file.history[file.history.length - 1];
        return { ...file, text: previousText, history: file.history.slice(0, -1) }; 
      }
      return file;
    }));
  };

  // מחיקת מילה שלמה
  const deleteWord = () => {
    if (!activeFile) return;
    const newText = calculateTextAfterWordDelete(activeFile.text); // שימוש בפונקציה מ-Utils שמחשבת את הטקסט לאחר מחיקת מילה, מוחקת את המילה האחרונה עד הרווח האחרון
    updateActiveFileText(newText);
  };

  //חיפוש והחלפה של תווים
  const handleFindAndReplace = () => {
    if (!activeFile) return; // אם אין חלון פעיל, לא מבצעים כלום
    const toFind = prompt("Find:"); // בקשת מהמשתמש להזין את התו שהוא רוצה למצוא
    if (!toFind) return;
    const toReplace = prompt("Replace:");
    if (toReplace === null) return;
    //עובר על הכל ואם יש התאמה מחליף
    updateActiveFileText(activeFile.text.map(item => item.char === toFind ? {...item, char: toReplace} : item)); 
  };

  // פונקציה שמנקה את כל הטקסט בחלון הפעיל
  const handleClearAll = () => updateActiveFileText([]);

  //פונקציית שמירת קובץ
  const saveFile = (fileToSave = activeFile) => {
    if (!fileToSave || !currentUser) { //צריך להיות מחובר כדי לשמור
      alert("You must be logged in to save files!");
      return false;
    }
    let fileName = fileToSave.name; //אם שם הקובץ הוא הברירת מחדל המשתמש מתבקש לשנות שם
    if (fileName === "New File") {
      const userInput = prompt("Enter file name:");
      if (userInput === null) return false; // אם המשתמש ביטל את ההזנה, לא שומרים את הקובץ
      fileName = userInput.trim() === "" ? "Untitled" : userInput; // אם המשתמש הזין רק רווחים, נקרא לקובץ "Untitled"
      setOpenFiles(prev => prev.map(f => f.id === fileToSave.id ? {...f, name: fileName} : f)); // עדכון שם הקובץ בחלון הפתוח כדי לשקף את השינוי בשם
    }
    
    saveToStorage(currentUser, fileName, fileToSave.text); //שמירת הקובץ בלוכל סטורג' על ידי שימוש בפונקציה מהutil
    setSavedFilesList(getUserFilesList(currentUser)); //עדכון רשימת הקבצים השמורים של המשתמש הנוכחי כדי להציג את הקובץ החדש ברשימה
    
    alert(`File "${fileName}" saved successfully for user ${currentUser}!`);
    return true; 
  };

  //טעינת קובץ ופתיחתו
  const loadFile = (fileName) => {
    const data = loadFromStorage(currentUser, fileName); //טעינה של הטקסט
    if (data) {
      const id = Date.now();
      setOpenFiles([...openFiles, { id, name: fileName, text: data, history: [] }]); //פתיחה בחלון חדש עם מזהה ייחודי, שם הקובץ, הטקסט שהטענו והיסטוריה ריקה
      setActiveFileId(id); //התמקדות בחלון החדש שנפתח
    }
  };

//מחיקת קובץ
  const handleDeleteFile = () => {
    if (!activeFile || !currentUser) return;
    const isSaved = loadFromStorage(currentUser, activeFile.name);
    
    if (!isSaved) {
      alert("This file isn't saved in your account.");
      return;
    }
    if (window.confirm(`Are you sure you want to delete "${activeFile.name}"?`)) {
      deleteFromStorage(currentUser, activeFile.name); // מחיקת הקובץ מהלוכל סטורג' על ידי שימוש בפונקציה מהutil
      setSavedFilesList(getUserFilesList(currentUser)); // עדכון רשימת הקבצים השמורים של המשתמש הנוכחי כדי להסיר את הקובץ מהרשימה
      setOpenFiles(prev => prev.filter(f => f.id !== activeFileId)); 
      alert("File deleted successfully!");
    }
  };

  // סגירת חלון עם בדיקת שמירת שינויים
  const handleCloseWindow = (id) => {
    const fileToClose = openFiles.find(f => f.id === id);
    if (!fileToClose) return;
    if (fileToClose.text.length > 0) { // אם יש טקסט בחלון, שואלים את המשתמש אם הוא רוצה לשמור לפני הסגירה
      if (window.confirm(`Do you want to save changes to "${fileToClose.name}"?`)) {
        if (!saveFile(fileToClose)) return;
      }
    }
    setOpenFiles(openFiles.filter(f => f.id !== id));
  };

  // הורדת קובץ טקסט
  const handleDownloadFile = () => {
    if (!activeFile || activeFile.text.length === 0) return;
    downloadAsTxt(activeFile.name, activeFile.text);
  };

  //החלת סגנון על כל הטקסט בחלון הפעיל
  const applyStyleToAll = () => {
    if(activeFile) updateActiveFileText(activeFile.text.map(item => ({...item, ...currentStyle})));
  };

  //התחברות של משתמש
  const handleLogin = () => {
    const name = prompt("הזן שם משתמש:");
    if (name && name.trim() !== "") {
      const userName = name.trim();
      setCurrentUser(userName);
      setSavedFilesList(getUserFilesList(userName));  //טעינת הקבצים
    }
  };

  return (
    <div className="app-container">
      {!currentUser ? ( /*אם אין משתמש תציג את מסך הכניסה*/
        <div style={{textAlign: 'center', marginTop: '50px'}}>
          <h1>Welcome to Multi-User Editor</h1>
          <button onClick={handleLogin} style={{padding: '15px 30px', fontSize: '1.2rem'}}>Login / Start</button>
        </div>
      ) : (
        <>
         {/* שורת משתמש עליונה */}
          <div className="user-bar" style={{width: '100%', maxWidth: '1200px', display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#00ffcc'}}>
            <span>User: <strong>{currentUser}</strong></span>
            <button onClick={() => {setCurrentUser(null); setOpenFiles([]);}}>Logout</button>
          </div>

          {/* סרגל ניהול קבצים */}
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

          {/*אזור החלונות הפתוחים*/}
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

          {/* אזור עבודה תחתון (פאנלים ומקלדת) */}
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