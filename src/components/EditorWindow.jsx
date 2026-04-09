import React from 'react';
import Display from './Display';

const EditorWindow = ({ file, isActive, onFocus, onClose }) => {
  return (
    <div 
      className={`editor-window ${isActive ? 'active-window' : ''}`} 
      onClick={onFocus}
    >
      <div className="window-header">
        <span className="window-title">{file.name}</span>
        <button 
          className="close-window-btn"
          onClick={(e) => {
            e.stopPropagation();
            onClose(); // שינוי קטן כאן
          }}
          title="Close Window"
        >
          ✖️
        </button>
      </div>
      
      <Display text={file.text} />
    </div>
  );
};

export default EditorWindow;