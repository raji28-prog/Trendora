import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateLayer, deleteLayer, reorderLayer } from '../../store/studioSlice.js';
import { AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline, Trash2, ArrowUp, ArrowDown, Type, Square, Image } from 'lucide-react';
import LayersPanel from './LayersPanel.jsx';

export const EditorRightPanel = () => {
  const dispatch = useDispatch();
  const { layers, selectedLayerIds } = useSelector(state => state.studio);
  
  if (selectedLayerIds.length === 0) {
    return (
      <div className="w-64 border-l border-border bg-surface flex flex-col h-full overflow-y-auto">
        <div className="p-4 flex flex-col items-center justify-center text-center text-textSecondary h-48 border-b border-border">
          <div className="w-12 h-12 bg-sectionBackground rounded-full flex items-center justify-center mb-3">
            <Type className="w-5 h-5 opacity-50" />
          </div>
          <p className="text-sm font-medium text-textPrimary mb-1">No layer selected</p>
          <p className="text-xs">Click on an element in the canvas to edit its properties.</p>
        </div>
        <div className="p-4">
          <LayersPanel />
        </div>
      </div>
    );
  }

  const selectedLayer = layers.find(l => l.id === selectedLayerIds[0]);
  if (!selectedLayer) return null;

  const handleChange = (field, value) => {
    dispatch(updateLayer({ id: selectedLayer.id, updates: { [field]: value } }));
  };

  return (
    <div className="w-64 border-l border-border bg-surface flex flex-col h-full overflow-y-auto">
      <div className="p-4 border-b border-border flex items-center justify-between sticky top-0 bg-surface z-10">
        <h3 className="font-semibold text-textPrimary capitalize">{selectedLayer.type} Properties</h3>
        <button 
          onClick={() => dispatch(deleteLayer(selectedLayer.id))}
          className="p-1.5 text-textSecondary hover:text-danger hover:bg-danger/10 rounded-md transition-colors"
          title="Delete Layer"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 flex flex-col gap-5">
        {/* Common Properties */}
        <div className="flex flex-col gap-3">
          <label className="text-[10px] font-bold text-textSecondary uppercase tracking-wider">Position & Size</label>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-textSecondary">X</span>
              <input type="number" value={selectedLayer.x} onChange={e => handleChange('x', parseInt(e.target.value))} className="w-full bg-sectionBackground border border-border rounded px-2 py-1 text-xs" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-textSecondary">Y</span>
              <input type="number" value={selectedLayer.y} onChange={e => handleChange('y', parseInt(e.target.value))} className="w-full bg-sectionBackground border border-border rounded px-2 py-1 text-xs" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-textSecondary">W</span>
              <input type="number" value={selectedLayer.width} onChange={e => handleChange('width', parseInt(e.target.value))} className="w-full bg-sectionBackground border border-border rounded px-2 py-1 text-xs" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-textSecondary">H</span>
              <input type="number" value={selectedLayer.height} onChange={e => handleChange('height', parseInt(e.target.value))} className="w-full bg-sectionBackground border border-border rounded px-2 py-1 text-xs" />
            </div>
          </div>
        </div>

        {/* Text Properties */}
        {selectedLayer.type === 'text' && (
          <>
            <div className="flex flex-col gap-3">
              <label className="text-[10px] font-bold text-textSecondary uppercase tracking-wider">Typography</label>
              
              <select 
                value={selectedLayer.fontFamily} 
                onChange={e => handleChange('fontFamily', e.target.value)}
                className="w-full bg-sectionBackground border border-border rounded px-2 py-1.5 text-xs focus:ring-1 focus:ring-primary focus:border-primary"
              >
                <option value="Inter">Inter</option>
                <option value="Arial">Arial</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Courier New">Courier New</option>
                <option value="Georgia">Georgia</option>
                <option value="Impact">Impact</option>
              </select>

              <div className="flex items-center gap-2">
                <input type="number" value={selectedLayer.fontSize} onChange={e => handleChange('fontSize', parseInt(e.target.value))} className="w-16 bg-sectionBackground border border-border rounded px-2 py-1.5 text-xs" />
                
                <div className="flex bg-sectionBackground border border-border rounded overflow-hidden">
                  <button onClick={() => handleChange('fontWeight', selectedLayer.fontWeight === 'bold' ? 'normal' : 'bold')} className={`p-1.5 ${selectedLayer.fontWeight === 'bold' ? 'bg-primary/10 text-primary' : 'text-textSecondary hover:bg-surface'}`}>
                    <Bold className="w-3.5 h-3.5" />
                  </button>
                  <div className="w-px bg-border" />
                  <button onClick={() => handleChange('fontStyle', selectedLayer.fontStyle === 'italic' ? 'normal' : 'italic')} className={`p-1.5 ${selectedLayer.fontStyle === 'italic' ? 'bg-primary/10 text-primary' : 'text-textSecondary hover:bg-surface'}`}>
                    <Italic className="w-3.5 h-3.5" />
                  </button>
                  <div className="w-px bg-border" />
                  <button onClick={() => handleChange('textDecoration', selectedLayer.textDecoration === 'underline' ? 'none' : 'underline')} className={`p-1.5 ${selectedLayer.textDecoration === 'underline' ? 'bg-primary/10 text-primary' : 'text-textSecondary hover:bg-surface'}`}>
                    <Underline className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between bg-sectionBackground border border-border rounded p-1">
                <button onClick={() => handleChange('textAlign', 'left')} className={`flex-1 p-1 rounded ${selectedLayer.textAlign === 'left' ? 'bg-surface shadow-sm text-textPrimary' : 'text-textSecondary hover:text-textPrimary'}`}>
                  <AlignLeft className="w-4 h-4 mx-auto" />
                </button>
                <button onClick={() => handleChange('textAlign', 'center')} className={`flex-1 p-1 rounded ${selectedLayer.textAlign === 'center' ? 'bg-surface shadow-sm text-textPrimary' : 'text-textSecondary hover:text-textPrimary'}`}>
                  <AlignCenter className="w-4 h-4 mx-auto" />
                </button>
                <button onClick={() => handleChange('textAlign', 'right')} className={`flex-1 p-1 rounded ${selectedLayer.textAlign === 'right' ? 'bg-surface shadow-sm text-textPrimary' : 'text-textSecondary hover:text-textPrimary'}`}>
                  <AlignRight className="w-4 h-4 mx-auto" />
                </button>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-xs text-textSecondary">Color</span>
                <div className="flex items-center gap-2">
                  <input type="color" value={selectedLayer.fill} onChange={e => handleChange('fill', e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
                  <input type="text" value={selectedLayer.fill} onChange={e => handleChange('fill', e.target.value)} className="flex-1 bg-sectionBackground border border-border rounded px-2 py-1.5 text-xs uppercase" />
                </div>
              </div>
            </div>
          </>
        )}

        {/* Shape Properties */}
        {selectedLayer.type === 'shape' && (
          <div className="flex flex-col gap-3">
            <label className="text-[10px] font-bold text-textSecondary uppercase tracking-wider">Appearance</label>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-textSecondary">Fill Color</span>
              <div className="flex items-center gap-2">
                <input type="color" value={selectedLayer.fill} onChange={e => handleChange('fill', e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
                <input type="text" value={selectedLayer.fill} onChange={e => handleChange('fill', e.target.value)} className="flex-1 bg-sectionBackground border border-border rounded px-2 py-1.5 text-xs uppercase" />
              </div>
            </div>
            
            {selectedLayer.shapeType !== 'circle' && (
              <div className="flex flex-col gap-1 mt-2">
                <span className="text-xs text-textSecondary">Corner Radius ({selectedLayer.borderRadius || 0}px)</span>
                <input type="range" min="0" max="100" value={selectedLayer.borderRadius || 0} onChange={e => handleChange('borderRadius', parseInt(e.target.value))} className="w-full accent-primary" />
              </div>
            )}
          </div>
        )}

        {/* Image Properties */}
        {selectedLayer.type === 'image' && (
          <div className="flex flex-col gap-3">
            <label className="text-[10px] font-bold text-textSecondary uppercase tracking-wider">Appearance</label>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-textSecondary">Corner Radius ({selectedLayer.borderRadius || 0}px)</span>
              <input type="range" min="0" max="100" value={selectedLayer.borderRadius || 0} onChange={e => handleChange('borderRadius', parseInt(e.target.value))} className="w-full accent-primary" />
            </div>
            <div className="flex flex-col gap-1 mt-2">
              <span className="text-xs text-textSecondary">Opacity ({selectedLayer.opacity !== undefined ? selectedLayer.opacity * 100 : 100}%)</span>
              <input type="range" min="0" max="1" step="0.1" value={selectedLayer.opacity !== undefined ? selectedLayer.opacity : 1} onChange={e => handleChange('opacity', parseFloat(e.target.value))} className="w-full accent-primary" />
            </div>
          </div>
        )}

        <hr className="border-border my-2" />

        {/* Layer Arrange */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-bold text-textSecondary uppercase tracking-wider">Arrange</label>
          <div className="flex gap-2">
            <button onClick={() => dispatch(reorderLayer({ id: selectedLayer.id, direction: 'up' }))} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 border border-border rounded bg-sectionBackground hover:bg-surface text-xs font-medium">
              <ArrowUp className="w-3.5 h-3.5" /> Forward
            </button>
            <button onClick={() => dispatch(reorderLayer({ id: selectedLayer.id, direction: 'down' }))} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 border border-border rounded bg-sectionBackground hover:bg-surface text-xs font-medium">
              <ArrowDown className="w-3.5 h-3.5" /> Backward
            </button>
          </div>
        </div>

        <hr className="border-border my-2" />
        
        <LayersPanel />
      </div>
    </div>
  );
};

export default EditorRightPanel;
