// src/utils/storageUtils.js

export const getUserFilesList = (userName) => {
  return Object.keys(localStorage)
    .filter(key => key.startsWith(`${userName}_`))
    .map(key => key.replace(`${userName}_`, ""));
};

export const saveToStorage = (userName, fileName, textArray) => {
  const storageKey = `${userName}_${fileName}`;
  localStorage.setItem(storageKey, JSON.stringify(textArray));
};

export const loadFromStorage = (userName, fileName) => {
  const storageKey = `${userName}_${fileName}`;
  const data = localStorage.getItem(storageKey);
  return data ? JSON.parse(data) : null;
};

export const deleteFromStorage = (userName, fileName) => {
  const storageKey = `${userName}_${fileName}`;
  localStorage.removeItem(storageKey);
};