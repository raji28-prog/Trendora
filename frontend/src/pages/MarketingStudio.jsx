import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToast } from '../store/uiSlice.js';
import studioApi from '../services/studioApi.js';
import Card from '../components/UI/Card.jsx';
import Button from '../components/UI/Button.jsx';
import { Plus, LayoutTemplate, Copy, Trash2, Search, Edit2 } from 'lucide-react';
import Input from '../components/UI/Input.jsx';

export const MarketingStudio = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('templates');
  const [categories, setCategories] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (activeTab === 'templates') {
          const [catRes, tplRes] = await Promise.all([
            studioApi.getCategories(),
            studioApi.getTemplates({ category: activeCategory !== 'All' ? activeCategory : undefined, search })
          ]);
          setCategories([{ name: 'All' }, ...(catRes.data.data.categories || [])]);
          setTemplates(tplRes.data.data.templates || []);
        } else {
          const res = await studioApi.getUserDesigns();
          setDesigns(res.data.data.designs || []);
        }
      } catch (err) {
        dispatch(addToast({ type: 'error', message: 'Failed to load studio data' }));
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [activeTab, activeCategory, search, dispatch]);

  const handleDeleteDesign = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Delete this design?')) return;
    try {
      await studioApi.deleteDesign(id);
      setDesigns(designs.filter(d => d.id !== id));
      dispatch(addToast({ type: 'success', message: 'Design deleted' }));
    } catch (err) {
      dispatch(addToast({ type: 'error', message: 'Failed to delete design' }));
    }
  };

  const handleDuplicateDesign = async (e, id) => {
    e.stopPropagation();
    try {
      const res = await studioApi.duplicateDesign(id);
      setDesigns([res.data.data.design, ...designs]);
      dispatch(addToast({ type: 'success', message: 'Design duplicated' }));
    } catch (err) {
      dispatch(addToast({ type: 'error', message: 'Failed to duplicate design' }));
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-textPrimary">Marketing Studio</h1>
          <p className="text-sm text-textSecondary">Create stunning marketing materials in seconds.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" icon={LayoutTemplate} onClick={() => navigate('/marketing-studio/editor/new')}>
            Custom Size
          </Button>
          <Button variant="primary" icon={Plus} onClick={() => navigate('/marketing-studio/editor/new')}>
            Blank Design
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-6 border-b border-border">
        <button 
          onClick={() => setActiveTab('templates')}
          className={`py-3 px-1 font-semibold text-sm border-b-2 transition-colors ${activeTab === 'templates' ? 'border-primary text-primary' : 'border-transparent text-textSecondary hover:text-textPrimary'}`}
        >
          Template Marketplace
        </button>
        <button 
          onClick={() => setActiveTab('designs')}
          className={`py-3 px-1 font-semibold text-sm border-b-2 transition-colors ${activeTab === 'designs' ? 'border-primary text-primary' : 'border-transparent text-textSecondary hover:text-textPrimary'}`}
        >
          My Designs
        </button>
      </div>

      {activeTab === 'templates' && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <div className="relative w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary" />
              <input 
                type="text" 
                placeholder="Search templates..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-surface border border-border rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            
            <div className="flex-1 overflow-x-auto pb-2 flex gap-2 hide-scrollbar">
              {categories.map(c => (
                <button 
                  key={c.name}
                  onClick={() => setActiveCategory(c.name)}
                  className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${activeCategory === c.name ? 'bg-primary text-white' : 'bg-surface border border-border text-textSecondary hover:border-primary/50'}`}
                >
                  {c.icon && <span className="mr-1">{c.icon}</span>}
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="animate-pulse bg-surface border border-border rounded-xl h-64"></div>
              ))}
            </div>
          ) : templates.length === 0 ? (
            <div className="text-center py-20 text-textSecondary">
              <LayoutTemplate className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>No templates found for this category or search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {templates.map(template => (
                <Card 
                  key={template.id} 
                  className="group overflow-hidden border-border hover:border-primary/50 hover:shadow-premium transition-all duration-300 cursor-pointer"
                  onClick={() => navigate(`/marketing-studio/editor/new?template=${template.id}`)}
                >
                  <div className="aspect-square relative flex items-center justify-center p-4 border-b border-border" style={{ backgroundColor: template.thumbnailBg || '#f8fafc' }}>
                    {/* Simulated Template Preview */}
                    <div className="bg-white shadow-sm w-3/4 h-3/4 rounded flex items-center justify-center relative overflow-hidden transition-transform duration-500 group-hover:scale-105">
                      <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDBMOCA4Wk04IDBMMCA4WiIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjEiIG9wYWNpdHk9IjAuMSI+PC9wYXRoPgo8L3N2Zz4=')]"></div>
                      <span className="font-bold text-center px-4 leading-tight" style={{ color: template.thumbnailBg }}>{template.title}</span>
                    </div>
                    
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button variant="primary" size="sm" icon={Edit2}>Customize</Button>
                    </div>
                    
                    {template.isPremium && (
                      <span className="absolute top-2 right-2 bg-amber-400 text-amber-950 text-[10px] font-bold px-2 py-0.5 rounded-sm flex items-center gap-1 shadow-sm">
                        PRO
                      </span>
                    )}
                  </div>
                  <Card.Content className="p-3">
                    <h3 className="text-sm font-bold text-textPrimary truncate">{template.title}</h3>
                    <p className="text-[10px] text-textSecondary uppercase tracking-wider mt-1">{template.category.name}</p>
                  </Card.Content>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'designs' && (
        <div className="flex flex-col gap-6">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse bg-surface border border-border rounded-xl h-64"></div>
              ))}
            </div>
          ) : designs.length === 0 ? (
            <div className="text-center py-20 text-textSecondary">
              <LayoutTemplate className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>You haven't created any designs yet.</p>
              <Button variant="outline" className="mt-4" onClick={() => setActiveTab('templates')}>Browse Templates</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {designs.map(design => (
                <Card 
                  key={design.id} 
                  className="group overflow-hidden border-border hover:border-primary/50 hover:shadow-premium transition-all duration-300 cursor-pointer"
                  onClick={() => navigate(`/marketing-studio/editor/${design.id}`)}
                >
                  <div className="aspect-square bg-slate-100 relative flex items-center justify-center p-4 border-b border-border">
                    {/* Simulated Design Preview */}
                    <div className="bg-white shadow-sm w-3/4 h-3/4 rounded flex items-center justify-center relative overflow-hidden transition-transform duration-500 group-hover:scale-105" style={{ backgroundColor: design.background }}>
                      <span className="font-bold text-center px-4 leading-tight text-white mix-blend-difference">{design.title}</span>
                    </div>
                    
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button variant="primary" size="sm" icon={Edit2}>Edit</Button>
                    </div>
                  </div>
                  <Card.Content className="p-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="overflow-hidden">
                        <h3 className="text-sm font-bold text-textPrimary truncate">{design.title}</h3>
                        <p className="text-[10px] text-textSecondary uppercase mt-0.5">Updated {new Date(design.updatedAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button onClick={(e) => handleDuplicateDesign(e, design.id)} className="p-1.5 text-textSecondary hover:text-primary bg-sectionBackground rounded hover:bg-primary/10" title="Duplicate">
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={(e) => handleDeleteDesign(e, design.id)} className="p-1.5 text-textSecondary hover:text-danger bg-sectionBackground rounded hover:bg-danger/10" title="Delete">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </Card.Content>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MarketingStudio;
