import React, { useState, useEffect } from 'react';
import Card from '../components/UI/Card.jsx';
import Button from '../components/UI/Button.jsx';
import Modal from '../components/UI/Modal.jsx';
import Input from '../components/UI/Input.jsx';
import EmptyState from '../components/UI/EmptyState.jsx';
import { addToast } from '../store/uiSlice.js';
import { useDispatch } from 'react-redux';
import { Plus, Image as ImageIcon, Camera, X, Download } from 'lucide-react';
import api from '../services/api.js';

export const Posters = () => {
  const dispatch = useDispatch();
  const [posters, setPosters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [format, setFormat] = useState('PNG');

  const fetchPosters = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/posters');
      setPosters(response.data.data || []);
    } catch (err) {
      if (!err.response) {
        const local = localStorage.getItem('demo_posters');
        if (local) {
          setPosters(JSON.parse(local));
        } else {
          const defaultPosters = [
            { id: 'post-1', title: 'Grand Opening Announcement Banner', imageUrl: '', format: 'PNG' }
          ];
          localStorage.setItem('demo_posters', JSON.stringify(defaultPosters));
          setPosters(defaultPosters);
        }
      } else {
        dispatch(addToast({ type: 'error', message: 'Failed to fetch posters' }));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosters();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        dispatch(addToast({ type: 'error', message: 'File is too large (>2MB).' }));
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title || !imageUrl) {
      dispatch(addToast({ type: 'warning', message: 'Please select a poster image' }));
      return;
    }

    const payload = { title, imageUrl, format };

    try {
      await api.post('/api/posters', payload);
      dispatch(addToast({ type: 'success', message: 'Poster uploaded successfully!' }));
      setIsCreateOpen(false);
      fetchPosters();
    } catch (err) {
      if (!err.response) {
        const newPoster = { id: `post-${Date.now()}`, title, imageUrl, format };
        const updated = [newPoster, ...posters];
        setPosters(updated);
        localStorage.setItem('demo_posters', JSON.stringify(updated));
        dispatch(addToast({ type: 'success', message: 'Demo Mode: Poster saved locally!' }));
        setIsCreateOpen(false);
      } else {
        dispatch(addToast({ type: 'error', message: 'Failed to upload poster' }));
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-textPrimary">Poster Designer</h1>
          <p className="text-xs text-textSecondary">Upload or review marketing flyers and billboard graphics.</p>
        </div>
        <Button variant="primary" icon={Plus} onClick={() => { setTitle(''); setImageUrl(''); setIsCreateOpen(true); }}>Upload Poster</Button>
      </div>

      {posters.length === 0 ? (
        <EmptyState title="No marketing posters" description="Upload banner graphic assets to represent your marketing campaigns." actionLabel="Upload Poster" onAction={() => setIsCreateOpen(true)} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posters.map((post) => (
            <Card key={post.id} className="group overflow-hidden border-border/85 hover:border-primary/20 hover:shadow-premium transition-all duration-300">
              <div className="h-60 bg-slate-50 relative flex items-center justify-center border-b border-border overflow-hidden">
                {post.imageUrl ? (
                  <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="flex flex-col items-center gap-1.5 text-slate-400">
                    <ImageIcon className="w-10 h-10" />
                    <span className="text-[10px] uppercase font-bold tracking-wider">No Image Preview</span>
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <Badge variant="primary">{post.format}</Badge>
                </div>
              </div>
              <Card.Content className="py-4">
                <h3 className="text-sm font-bold text-textPrimary leading-tight truncate">{post.title}</h3>
              </Card.Content>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Upload Poster Image">
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <Input label="Poster Title *" placeholder="e.g. Winter Grand Clearance Flyer" value={title} onChange={(e) => setTitle(e.target.value)} required />
          
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-textSecondary">Poster Image *</label>
            {imageUrl ? (
              <div className="relative h-48 w-full border border-border rounded-xl bg-slate-50 overflow-hidden">
                <img src={imageUrl} alt="preview" className="w-full h-full object-contain" />
                <button
                  type="button"
                  onClick={() => setImageUrl('')}
                  className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/85 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center border-2 border-dashed border-border hover:border-primary/30 rounded-xl p-8 transition-all relative cursor-pointer">
                <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageChange} />
                <div className="flex flex-col items-center gap-1.5 text-textSecondary">
                  <Camera className="w-6 h-6 text-primary" />
                  <span className="text-xs">Drag and drop file or click to select</span>
                  <span className="text-[10px] text-slate-400">Format: PNG, JPG, or SVG</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-4 border-t border-border pt-4">
            <Button type="button" variant="secondary" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Upload Asset</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Posters;
