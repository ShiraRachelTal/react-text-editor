export const downloadAsTxt = (fileName, textArray) => {
  if (!textArray || textArray.length === 0) return; // מניעת הורדה של קובץ ריק
  const plainText = textArray.map(item => item.char).join(''); // חילוץ הנתוניפ בלי הסגנון שלהם ויצירת מחרוזת טקסט פשוטה
  const blob = new Blob([plainText], { type: 'text/plain;charset=utf-8' }); // יצירת Blob מסוג טקסט
  const link = document.createElement('a'); // יצירת אלמנט קישור זמני
  link.href = URL.createObjectURL(blob); // יצירת URL זמני ל-Blob
  link.download = `${fileName}.txt`;
  link.click(); //לחיצה על הקישור כדי להפעיל את הורדת הקובץ
};