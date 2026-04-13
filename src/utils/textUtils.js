// src/utils/textUtils.js

// הפונקציה מקבלת את מערך הטקסט כפרמטר במקום לקרוא ישירות מ-activeFile
export const checkShouldCapitalize = (textArray) => {
  if (!textArray || textArray.length === 0) return true;
  let lastChar = null;
  for (let i = textArray.length - 1; i >= 0; i--) {
    if (textArray[i].char !== ' ' && textArray[i].char !== '\n') {
      lastChar = textArray[i].char;
      break;
    }
  }
  if (lastChar === null) return true; 
  return ['.', '!', '?'].includes(lastChar);
};

// אפשר גם להוציא את הלוגיקה של מחיקת מילה
export const calculateTextAfterWordDelete = (textArray) => {
  let lastSpaceIndex = -1;
  for (let i = textArray.length - 1; i >= 0; i--) {
    if (textArray[i].char === " ") { 
      lastSpaceIndex = i; 
      break; 
    }
  }
  return lastSpaceIndex !== -1 ? textArray.slice(0, lastSpaceIndex + 1) : [];
};