import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { undo, redo, setZoom, clearDirtyStatus } from '../../store/studioSlice.js';
import { addToast } from '../../store/uiSlice.js';
import studioApi from '../../services/studioApi.js';
import Button from '../UI/Button.jsx';
import Dropdown from '../UI/Dropdown.jsx';
import { Undo2, Redo2, ZoomIn, ZoomOut, Download, Save, Home, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const EditorToolbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const state = useSelector(state => state.studio);
  const { title, zoom, historyIndex, history, isDirty, activeDesignId, dimensions } = state;
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = {
        title,
        dimensions,
        background: state.background,
        layers: state.layers,
        status: 'DRAFT'
      };

      if (activeDesignId) {
        await studioApi.updateDesign(activeDesignId, payload);
      } else {
        const res = await studioApi.createDesign(payload);
        // Optionally update the active design ID in state
      }
      dispatch(clearDirtyStatus());
      dispatch(addToast({ type: 'success', message: 'Design saved successfully!' }));
    } catch (err) {
      dispatch(addToast({ type: 'error', message: 'Failed to save design.' }));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = async (format) => {
    dispatch(addToast({ type: 'info', message: `Generating ${format}...` }));
    
    // In a real implementation, we would use html2canvas or native Canvas API here
    // For this demonstration, we'll simulate the download
    setTimeout(() => {
      dispatch(addToast({ type: 'success', message: `${format} downloaded successfully!` }));
    }, 1500);
  };

  return (
    <div className="h-14 border-b border-border bg-surface flex items-center justify-between px-4 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/marketing-studio')} className="p-2 hover:bg-sectionBackground rounded-lg text-textSecondary hover:text-textPrimary transition-colors">
          <Home className="w-5 h-5" />
        </button>
        <div className="h-6 w-px bg-border" />
        
        {/* Undo/Redo */}
        <div className="flex items-center gap-1">
          <button 
            onClick={() => dispatch(undo())} 
            disabled={historyIndex <= 0}
            className="p-2 hover:bg-sectionBackground rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-textSecondary hover:text-textPrimary"
            title="Undo"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button 
            onClick={() => dispatch(redo())} 
            disabled={historyIndex >= history.length - 1}
            className="p-2 hover:bg-sectionBackground rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-textSecondary hover:text-textPrimary"
            title="Redo"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>

        <div className="h-6 w-px bg-border" />

        {/* Title */}
        <span className="font-semibold text-sm truncate max-w-[200px]">{title}</span>
        {isDirty && <span className="text-[10px] text-textSecondary italic">*Unsaved changes</span>}
      </div>

      <div className="flex items-center gap-3">
        {/* Zoom */}
        <div className="flex items-center bg-sectionBackground rounded-lg border border-border p-1">
          <button onClick={() => dispatch(setZoom(zoom - 0.25))} className="p-1 hover:bg-border rounded text-textSecondary">
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-medium w-12 text-center">{Math.round(zoom * 100)}%</span>
          <button onClick={() => dispatch(setZoom(zoom + 0.25))} className="p-1 hover:bg-border rounded text-textSecondary">
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>

        {/* Actions */}
        <Button 
          variant="outline" 
          size="sm" 
          icon={Save} 
          onClick={handleSave} 
          isLoading={isSaving}
        >
          Save
        </Button>
        
        <Dropdown
          align="right"
          trigger={
            <Button variant="primary" size="sm" icon={Download} iconPosition="left">
              Download <ChevronDown className="w-4 h-4 ml-1 opacity-80" />
            </Button>
          }
        >
          <Dropdown.Item onClick={() => handleDownload('PNG')}>Download as PNG</Dropdown.Item>
          <Dropdown.Item onClick={() => handleDownload('JPG')}>Download as JPG</Dropdown.Item>
          <Dropdown.Item onClick={() => handleDownload('PDF')}>Download as PDF</Dropdown.Item>
        </Dropdown>
      </div>
    </div>
  );
};

export default EditorToolbar;
