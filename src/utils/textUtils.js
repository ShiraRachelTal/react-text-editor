//הוספת פונקציה לבדיקת האם יש צורך להגדיל את האות הראשונה של המילה הבאה על פי התו האחרון במערך הטקסט
export const checkShouldCapitalize = (textArray) => {
  if (!textArray || textArray.length === 0) return true;
  let lastChar = null;
  // מעבר מהסוף להתחלה כדי למצוא את התו האחרון שאינו רווח או שורה חדשה
  for (let i = textArray.length - 1; i >= 0; i--) {
    if (textArray[i].char !== ' ' && textArray[i].char !== '\n') {
      lastChar = textArray[i].char;
      break;
    }
  }
  if (lastChar === null) return true; 
  return ['.', '!', '?'].includes(lastChar); // אם התו האחרון הוא אחד מסימני הפיסוק, יש להגדיל את האות הבאה
};

// פונקציה לחישוב הטקסט לאחר מחיקת מילה, מוחקת את המילה האחרונה עד הרווח האחרון
export const calculateTextAfterWordDelete = (textArray) => {
  let lastSpaceIndex = -1;
  // מעבר מהסוף להתחלה כדי למצוא את הרווח האחרון
  for (let i = textArray.length - 1; i >= 0; i--) {
    if (textArray[i].char === " ") { 
      lastSpaceIndex = i; 
      break; 
    }
  }
  return lastSpaceIndex !== -1 ? textArray.slice(0, lastSpaceIndex + 1) : []; // אם מצאנו רווח מוחקים עד אליו ואם לא נמצא רווח, מוחקים הכל
};