import React, { useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateLayer, selectLayer } from '../../store/studioSlice.js';

export const LayerElement = ({ layer, zoom }) => {
  const dispatch = useDispatch();
  const selectedLayerIds = useSelector((state) => state.studio.selectedLayerIds);
  const isSelected = selectedLayerIds.includes(layer.id);
  const elementRef = useRef(null);

  // Handle Dragging
  const handleMouseDown = (e) => {
    if (layer.isLocked) return;
    e.stopPropagation();
    if (!isSelected) {
      dispatch(selectLayer({ id: layer.id, multiSelect: e.shiftKey }));
    }

    const startX = e.clientX;
    const startY = e.clientY;
    const initialX = layer.x;
    const initialY = layer.y;

    const onMouseMove = (moveEvent) => {
      const dx = (moveEvent.clientX - startX) / zoom;
      const dy = (moveEvent.clientY - startY) / zoom;
      dispatch(updateLayer({
        id: layer.id,
        updates: { x: Math.round(initialX + dx), y: Math.round(initialY + dy) }
      }));
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const handleTextChange = (e) => {
    if (layer.type === 'text') {
      dispatch(updateLayer({ id: layer.id, updates: { text: e.target.innerText } }));
    }
  };

  const style = {
    position: 'absolute',
    left: `${layer.x}px`,
    top: `${layer.y}px`,
    width: `${layer.width}px`,
    height: `${layer.height}px`,
    zIndex: layer.zIndex,
    transform: `rotate(${layer.rotation || 0}deg)`,
    opacity: layer.opacity !== undefined ? layer.opacity : 1,
    cursor: layer.isLocked ? 'default' : 'move',
    pointerEvents: layer.isHidden ? 'none' : 'auto',
    display: layer.isHidden ? 'none' : 'flex',
  };

  if (isSelected) {
    style.outline = '2px solid var(--primary)';
    style.outlineOffset = '2px';
  }

  const renderContent = () => {
    switch (layer.type) {
      case 'text':
        return (
          <div
            ref={elementRef}
            contentEditable={isSelected && !layer.isLocked}
            suppressContentEditableWarning
            onBlur={handleTextChange}
            style={{
              width: '100%', height: '100%',
              color: layer.fill,
              fontFamily: layer.fontFamily,
              fontSize: `${layer.fontSize}px`,
              fontWeight: layer.fontWeight,
              fontStyle: layer.fontStyle,
              textDecoration: layer.textDecoration,
              textAlign: layer.textAlign,
              letterSpacing: `${layer.letterSpacing || 0}px`,
              lineHeight: layer.lineHeight || 1.2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: layer.textAlign === 'center' ? 'center' : layer.textAlign === 'right' ? 'flex-end' : 'flex-start',
              outline: 'none',
              wordBreak: 'break-word'
            }}
          >
            {layer.text}
          </div>
        );
      case 'image':
        return (
          <img
            src={layer.src}
            alt="Layer"
            draggable={false}
            style={{
              width: '100%', height: '100%',
              objectFit: layer.objectFit || 'cover',
              borderRadius: `${layer.borderRadius || 0}px`,
              filter: `brightness(${layer.brightness || 100}%) contrast(${layer.contrast || 100}%)`
            }}
          />
        );
      case 'shape':
        if (layer.shapeType === 'circle') {
          return <div style={{ width: '100%', height: '100%', borderRadius: '50%', backgroundColor: layer.fill, border: layer.stroke ? `${layer.strokeWidth}px solid ${layer.stroke}` : 'none' }} />;
        }
        return <div style={{ width: '100%', height: '100%', backgroundColor: layer.fill, border: layer.stroke ? `${layer.strokeWidth}px solid ${layer.stroke}` : 'none', borderRadius: `${layer.borderRadius || 0}px` }} />;
      default:
        return null;
    }
  };

  return (
    <div style={style} onMouseDown={handleMouseDown}>
      {renderContent()}
    </div>
  );
};

export default LayerElement;
