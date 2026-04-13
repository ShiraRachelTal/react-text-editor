//קבלת רשימת שמות הקבצים של משתמש מסוים מה-localStorage
export const getUserFilesList = (userName) => {
  return Object.keys(localStorage)
    .filter(key => key.startsWith(`${userName}_`)) // סינון המפתחות שמתחילים בשם המשתמש
    .map(key => key.replace(`${userName}_`, "")); // הסרת שם המשתמש מהשם המוצג של הקובץ
};

// שמירת קובץ עם שם משתמש, שם קובץ ומערך טקסט
export const saveToStorage = (userName, fileName, textArray) => {
  const storageKey = `${userName}_${fileName}`; //שם המפתח הוא צירוף של שם המשתמש ושם הקובץ
  localStorage.setItem(storageKey, JSON.stringify(textArray));
};

// טעינת קובץ על ידי שם משתמש ושם קובץ, מחזירה את מערך הטקסט או null אם לא נמצא
export const loadFromStorage = (userName, fileName) => {
  const storageKey = `${userName}_${fileName}`; 
  const data = localStorage.getItem(storageKey);
  return data ? JSON.parse(data) : null;
};

// מחיקת קובץ על ידי שם משתמש ושם קובץ
export const deleteFromStorage = (userName, fileName) => {
  const storageKey = `${userName}_${fileName}`; // יצירת המפתח על פי שם המשתמש ושם הקובץ
  localStorage.removeItem(storageKey);
};