import React, { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectLayer } from '../../store/studioSlice.js';
import LayerElement from './LayerElement.jsx';

export const EditorCanvas = () => {
  const dispatch = useDispatch();
  const { dimensions, background, layers, zoom } = useSelector((state) => state.studio);
  const containerRef = useRef(null);

  const handleBackgroundClick = (e) => {
    if (e.target === containerRef.current) {
      dispatch(selectLayer({ id: null }));
    }
  };

  const canvasStyle = {
    width: `${dimensions.width}px`,
    height: `${dimensions.height}px`,
    background: background,
    position: 'relative',
    transform: `scale(${zoom})`,
    transformOrigin: 'top left',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    overflow: 'hidden',
    transition: 'transform 0.2s ease-out'
  };

  // Ensure layers are sorted by zIndex for proper rendering
  const sortedLayers = [...layers].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));

  return (
    <div 
      className="w-full h-full overflow-auto bg-slate-100 flex items-start justify-center p-8"
      onClick={handleBackgroundClick}
    >
      {/* Wrapper ensures scrollbars work correctly with scaling */}
      <div 
        style={{ 
          width: `${dimensions.width * zoom}px`, 
          height: `${dimensions.height * zoom}px`,
          flexShrink: 0
        }}
      >
        <div ref={containerRef} style={canvasStyle} id="studio-canvas">
          {sortedLayers.map((layer) => (
            <LayerElement key={layer.id} layer={layer} zoom={zoom} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EditorCanvas;
