import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateLayer, selectLayer, reorderLayer } from '../../store/studioSlice.js';
import { Type, Square, Image, Eye, EyeOff, Lock, Unlock, GripVertical } from 'lucide-react';

export const LayersPanel = () => {
  const dispatch = useDispatch();
  const { layers, selectedLayerIds } = useSelector(state => state.studio);
  
  // Sort descending for display (top layer visually is first in list)
  const displayLayers = [...layers].sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0));

  const toggleVisibility = (e, layer) => {
    e.stopPropagation();
    dispatch(updateLayer({ id: layer.id, updates: { isHidden: !layer.isHidden } }));
  };

  const toggleLock = (e, layer) => {
    e.stopPropagation();
    dispatch(updateLayer({ id: layer.id, updates: { isLocked: !layer.isLocked } }));
  };

  const getLayerIcon = (type) => {
    switch (type) {
      case 'text': return <Type className="w-3.5 h-3.5 text-blue-500" />;
      case 'shape': return <Square className="w-3.5 h-3.5 text-purple-500" />;
      case 'image': return <Image className="w-3.5 h-3.5 text-emerald-500" />;
      default: return <Square className="w-3.5 h-3.5" />;
    }
  };

  const getLayerLabel = (layer) => {
    if (layer.type === 'text') return layer.text.substring(0, 20) + (layer.text.length > 20 ? '...' : '');
    if (layer.type === 'shape') return `${layer.shapeType} Shape`;
    return 'Image Layer';
  };

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-xs font-bold text-textSecondary uppercase tracking-wider mb-2">Layers</h3>
      
      <div className="flex flex-col gap-1 max-h-[300px] overflow-y-auto pr-1">
        {displayLayers.length === 0 ? (
          <p className="text-xs text-textSecondary text-center py-4">No layers added</p>
        ) : (
          displayLayers.map(layer => {
            const isSelected = selectedLayerIds.includes(layer.id);
            
            return (
              <div 
                key={layer.id}
                onClick={() => dispatch(selectLayer({ id: layer.id }))}
                className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors border ${
                  isSelected ? 'bg-primary/10 border-primary/30' : 'bg-surface border-border hover:border-textSecondary/30'
                }`}
              >
                <div className="flex items-center gap-2 overflow-hidden flex-1">
                  <div className="cursor-grab text-textSecondary hover:text-textPrimary active:cursor-grabbing">
                    <GripVertical className="w-3.5 h-3.5" />
                  </div>
                  {getLayerIcon(layer.type)}
                  <span className={`text-xs truncate ${isSelected ? 'font-medium text-primary' : 'text-textPrimary'} ${layer.isHidden ? 'opacity-50' : ''}`}>
                    {getLayerLabel(layer)}
                  </span>
                </div>
                
                <div className="flex items-center gap-1 shrink-0 ml-2">
                  <button onClick={(e) => toggleLock(e, layer)} className={`p-1 rounded hover:bg-black/5 ${layer.isLocked ? 'text-danger' : 'text-textSecondary'}`}>
                    {layer.isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                  </button>
                  <button onClick={(e) => toggleVisibility(e, layer)} className={`p-1 rounded hover:bg-black/5 ${layer.isHidden ? 'text-textSecondary opacity-50' : 'text-textSecondary'}`}>
                    {layer.isHidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default LayersPanel;
