import React from 'react';

const ActionsPanel = ({ onUndo, onDeleteWord, onFindAndReplace, onClearAll }) => {
  return (
    <div className="side-panel">
      <h3 className="panel-title">Actions</h3>
      <button onClick={onUndo}>Undo ↩️</button>
      <button onClick={onDeleteWord}>Delete Word 🔙</button>
      <button onClick={onFindAndReplace}>Find & Replace 🔍</button>
      <button onClick={onClearAll}>Clear All ✨</button>
    </div>
  );
};

export default ActionsPanel;