import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setDesign } from '../store/studioSlice.js';
import studioApi from '../services/studioApi.js';
import EditorToolbar from '../components/studio/EditorToolbar.jsx';
import EditorLeftPanel from '../components/studio/EditorLeftPanel.jsx';
import EditorCanvas from '../components/studio/EditorCanvas.jsx';
import EditorRightPanel from '../components/studio/EditorRightPanel.jsx';
import { addToast } from '../store/uiSlice.js';
import { Loader2 } from 'lucide-react';

export const StudioEditor = () => {
  const { id } = useParams(); // If id is 'new', it's a new design, otherwise load existing design
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDesign = async () => {
      setLoading(true);
      try {
        if (id && id !== 'new') {
          // Check if it's a template parameter (e.g. ?template=123)
          const urlParams = new URLSearchParams(window.location.search);
          const templateId = urlParams.get('template');
          
          if (templateId) {
            const response = await studioApi.getTemplate(templateId);
            const t = response.data.data.template;
            dispatch(setDesign({
              templateId: t.id,
              title: `Copy of ${t.title}`,
              dimensions: t.dimensions,
              background: t.thumbnailBg || '#ffffff',
              layers: t.layers || [],
            }));
          } else {
            const response = await studioApi.getDesign(id);
            const d = response.data.data.design;
            dispatch(setDesign({
              id: d.id,
              templateId: d.templateId,
              title: d.title,
              dimensions: d.dimensions,
              background: d.background,
              layers: d.layers,
            }));
          }
        } else {
          // New blank design
          dispatch(setDesign({
            title: 'Untitled Design',
            dimensions: { width: 1080, height: 1080 },
            background: '#ffffff',
            layers: []
          }));
        }
      } catch (err) {
        dispatch(addToast({ type: 'error', message: 'Failed to load design' }));
        navigate('/marketing-studio');
      } finally {
        setLoading(false);
      }
    };
    
    loadDesign();
  }, [id, dispatch, navigate]);

  if (loading) {
    return (
      <div className="h-screen w-screen bg-background flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
        <p className="text-textSecondary font-medium">Loading studio...</p>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-background flex flex-col overflow-hidden text-textPrimary">
      <EditorToolbar />
      <div className="flex-1 flex overflow-hidden">
        <EditorLeftPanel />
        <div className="flex-1 flex flex-col">
          <EditorCanvas />
        </div>
        <EditorRightPanel />
      </div>
    </div>
  );
};

export default StudioEditor;
