// src/utils/fileUtils.js

export const downloadAsTxt = (fileName, textArray) => {
  if (!textArray || textArray.length === 0) return;
  const plainText = textArray.map(item => item.char).join('');
  const blob = new Blob([plainText], { type: 'text/plain;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${fileName}.txt`;
  link.click();
};