import React from 'react';
import { COLORS } from '../constants';

const DesignPanel = ({ currentStyle, setCurrentStyle, applyToAll }) => {
  return (
    <div className="side-panel">
      <h3 className="panel-title">Design</h3>
      <div className="color-picker">
        {COLORS.map(c => (
          <button 
            key={c} 
            className={`color-circle ${currentStyle.color === c ? "selected" : ""}`} 
            style={{backgroundColor: c}} 
            onClick={() => setCurrentStyle({...currentStyle, color: c})} 
          />
        ))}
      </div>
      <select className="toolbar-select" value={currentStyle.fontSize} onChange={(e) => setCurrentStyle({...currentStyle, fontSize: e.target.value})}>
        <option value="16px">Small</option>
        <option value="28px">Large</option>
        <option value="40px">Huge</option>
      </select>
      <select className="toolbar-select" value={currentStyle.fontFamily} onChange={(e) => setCurrentStyle({...currentStyle, fontFamily: e.target.value})}>
        <option value="sans-serif">Regular</option>
        <option value="cursive">Cursive</option>
        <option value="monospace">Monospace</option>
      </select>
      <button onClick={applyToAll} className="apply-all-btn">Apply to All ✨</button>
    </div>
  );
};

export default DesignPanel;