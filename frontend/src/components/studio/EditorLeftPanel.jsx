import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addLayer, updateBackground } from '../../store/studioSlice.js';
import { LayoutTemplate, Type, Square, Image, Palette } from 'lucide-react';
import Button from '../UI/Button.jsx';
import Input from '../UI/Input.jsx';

export const EditorLeftPanel = () => {
  const dispatch = useDispatch();
  const dimensions = useSelector(state => state.studio.dimensions);
  const [activeTab, setActiveTab] = useState('text');

  const tabs = [
    { id: 'templates', icon: LayoutTemplate, label: 'Design' },
    { id: 'text', icon: Type, label: 'Text' },
    { id: 'shapes', icon: Square, label: 'Elements' },
    { id: 'images', icon: Image, label: 'Uploads' },
    { id: 'bg', icon: Palette, label: 'Background' }
  ];

  const handleAddText = (preset) => {
    const baseLayer = {
      id: `text-${Date.now()}`,
      type: 'text',
      fill: '#1e293b',
      fontFamily: 'Inter',
      textAlign: 'center',
      x: dimensions.width / 2 - 200,
      width: 400,
    };

    let textConfig = {};
    if (preset === 'heading') {
      textConfig = { text: 'Add a heading', fontSize: 64, fontWeight: 'bold', y: dimensions.height / 2 - 100, height: 80 };
    } else if (preset === 'subheading') {
      textConfig = { text: 'Add a subheading', fontSize: 36, fontWeight: '600', y: dimensions.height / 2, height: 50 };
    } else {
      textConfig = { text: 'Add a little bit of body text', fontSize: 24, fontWeight: 'normal', y: dimensions.height / 2 + 100, height: 40 };
    }

    dispatch(addLayer({ ...baseLayer, ...textConfig }));
  };

  const handleAddShape = (type) => {
    dispatch(addLayer({
      id: `shape-${Date.now()}`,
      type: 'shape',
      shapeType: type,
      fill: '#6D5EF8',
      x: dimensions.width / 2 - 100,
      y: dimensions.height / 2 - 100,
      width: 200,
      height: 200,
      borderRadius: type === 'circle' ? 100 : 0
    }));
  };

  return (
    <div className="w-80 border-r border-border bg-surface flex h-full">
      {/* Tab Navigation */}
      <div className="w-20 border-r border-border bg-sectionBackground flex flex-col items-center py-4 gap-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-16 h-16 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-colors ${
              activeTab === tab.id ? 'bg-surface text-primary shadow-sm border border-border' : 'text-textSecondary hover:bg-surface/50 hover:text-textPrimary'
            }`}
          >
            <tab.icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 flex flex-col h-full bg-surface">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold text-textPrimary capitalize">{tabs.find(t => t.id === activeTab)?.label}</h3>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          
          {activeTab === 'text' && (
            <div className="flex flex-col gap-3">
              <Button variant="outline" className="h-16 justify-center bg-sectionBackground hover:bg-primary/5 hover:border-primary/30" onClick={() => handleAddText('heading')}>
                <span className="text-xl font-bold">Add a heading</span>
              </Button>
              <Button variant="outline" className="h-12 justify-center bg-sectionBackground hover:bg-primary/5 hover:border-primary/30" onClick={() => handleAddText('subheading')}>
                <span className="text-lg font-semibold">Add a subheading</span>
              </Button>
              <Button variant="outline" className="h-10 justify-center bg-sectionBackground hover:bg-primary/5 hover:border-primary/30" onClick={() => handleAddText('body')}>
                <span className="text-sm">Add a little bit of body text</span>
              </Button>
            </div>
          )}

          {activeTab === 'shapes' && (
            <div className="grid grid-cols-2 gap-3">
              <div 
                className="aspect-square bg-sectionBackground border border-border rounded-lg flex items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all"
                onClick={() => handleAddShape('rectangle')}
              >
                <div className="w-12 h-12 bg-textSecondary rounded-sm"></div>
              </div>
              <div 
                className="aspect-square bg-sectionBackground border border-border rounded-lg flex items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all"
                onClick={() => handleAddShape('circle')}
              >
                <div className="w-12 h-12 bg-textSecondary rounded-full"></div>
              </div>
            </div>
          )}

          {activeTab === 'bg' && (
            <div className="flex flex-col gap-4">
              <p className="text-xs text-textSecondary">Solid Colors</p>
              <div className="grid grid-cols-4 gap-2">
                {['#ffffff', '#f8fafc', '#1e293b', '#6D5EF8', '#ef4444', '#f59e0b', '#22c55e', '#3b82f6'].map(color => (
                  <button
                    key={color}
                    className="aspect-square rounded-md border border-border hover:scale-110 transition-transform shadow-sm"
                    style={{ backgroundColor: color }}
                    onClick={() => dispatch(updateBackground(color))}
                  />
                ))}
              </div>
              
              <div className="mt-4">
                <label className="text-xs text-textSecondary font-medium mb-1.5 block">Custom Hex</label>
                <Input 
                  type="text" 
                  placeholder="#000000" 
                  onChange={(e) => {
                    if (e.target.value.length >= 4) dispatch(updateBackground(e.target.value));
                  }}
                />
              </div>
            </div>
          )}

          {/* Placeholders for others */}
          {(activeTab === 'templates' || activeTab === 'images') && (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-textSecondary gap-2 p-4">
              <p className="text-sm">This feature is available in the Template Marketplace and Asset Library components.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default EditorLeftPanel;
