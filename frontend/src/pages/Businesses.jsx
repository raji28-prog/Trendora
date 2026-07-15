import React, { useState, useEffect } from 'react';
import Card from '../components/UI/Card.jsx';
import Button from '../components/UI/Button.jsx';
import Input from '../components/UI/Input.jsx';
import Select from '../components/UI/Select.jsx';
import Badge from '../components/UI/Badge.jsx';
import Modal from '../components/UI/Modal.jsx';
import EmptyState from '../components/UI/EmptyState.jsx';
import { addToast } from '../store/uiSlice.js';
import { useDispatch } from 'react-redux';
import { setBusinesses as setGlobalBusinesses } from '../store/businessSlice.js';
import { useSelectedBusiness } from '../store/useSelectedBusiness.js';
import { Search, Plus, Edit2, Trash2, Globe, Phone, MapPin, Building, X, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import api from '../services/api.js';

export const Businesses = () => {
  const dispatch = useDispatch();
  const { selectedBusinessId, setSelected } = useSelectedBusiness();
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  
  // Modal states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentBusiness, setCurrentBusiness] = useState(null);

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [images, setImages] = useState([]); // Base64 strings array
  const [status, setStatus] = useState('ACTIVE');

  // Load from API and sync with global store
  const fetchBusinesses = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/businesses');
      const list = response.data.data || [];
      setBusinesses(list);
      dispatch(setGlobalBusinesses(list));
    } catch (err) {
      if (!err.response) {
        // Backend offline: Use local storage mock database
        const local = localStorage.getItem('demo_businesses');
        if (local) {
          const list = JSON.parse(local);
          setBusinesses(list);
          dispatch(setGlobalBusinesses(list));
        }
        dispatch(addToast({ type: 'info', message: 'Demo Mode: Running client-side database.' }));
      } else {
        dispatch(addToast({ type: 'error', message: 'Failed to fetch businesses' }));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const saveLocalBusinesses = (updated) => {
    setBusinesses(updated);
    dispatch(setGlobalBusinesses(updated));
    localStorage.setItem('demo_businesses', JSON.stringify(updated));
  };

  // Image Upload handler (stores raw files in images state)
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    
    const validFiles = files.filter((file) => {
      if (file.size > 2 * 1024 * 1024) {
        dispatch(addToast({ type: 'error', message: `${file.name} is too large (>2MB).` }));
        return false;
      }
      return true;
    });

    setImages((prev) => [...prev, ...validFiles]);
  };

  const removeSelectedImage = (idx) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const resetForm = () => {
    setName('');
    setCategory('');
    setAddress('');
    setPhone('');
    setWebsite('');
    setImages([]);
    setStatus('ACTIVE');
    setCurrentBusiness(null);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!name || !category || !address || !phone) {
      dispatch(addToast({ type: 'warning', message: 'Please fill in all required fields' }));
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('category', category);
    formData.append('address', address);
    formData.append('phone', phone);
    if (website) formData.append('website', website);
    formData.append('status', status);

    images.forEach((img) => {
      if (img instanceof File) {
        formData.append('images', img);
      }
    });

    try {
      const response = await api.post('/api/businesses', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      dispatch(addToast({ type: 'success', message: 'Business created successfully!' }));
      setIsCreateOpen(false);
      resetForm();
      fetchBusinesses();
    } catch (err) {
      if (!err.response) {
        // Backend offline mock create
        const mockImages = images.map((img) => {
          if (img instanceof File) {
            return URL.createObjectURL(img);
          }
          return img;
        });
        const newBiz = {
          id: `demo-${Date.now()}`,
          name,
          category,
          address,
          phone,
          website,
          images: mockImages,
          status,
          createdAt: new Date().toISOString()
        };
        const updated = [newBiz, ...businesses];
        saveLocalBusinesses(updated);
        dispatch(addToast({ type: 'success', message: 'Demo Mode: Business simulated successfully!' }));
        setIsCreateOpen(false);
        resetForm();
      } else {
        const errMsg = err.response?.data?.error?.message || 'Failed to create business';
        dispatch(addToast({ type: 'error', message: errMsg }));
      }
    }
  };

  const openEditModal = (biz) => {
    setCurrentBusiness(biz);
    setName(biz.name);
    setCategory(biz.category);
    setAddress(biz.address);
    setPhone(biz.phone);
    setWebsite(biz.website || '');
    setImages(biz.images || []);
    setStatus(biz.status);
    setIsEditOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!name || !category || !address || !phone) {
      dispatch(addToast({ type: 'warning', message: 'Please fill in all required fields' }));
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('category', category);
    formData.append('address', address);
    formData.append('phone', phone);
    if (website) formData.append('website', website);
    formData.append('status', status);

    images.forEach((img) => {
      if (img instanceof File) {
        formData.append('images', img);
      } else if (typeof img === 'string') {
        formData.append('existingImages', img);
      }
    });

    try {
      await api.put(`/api/businesses/${currentBusiness.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      dispatch(addToast({ type: 'success', message: 'Business updated successfully!' }));
      setIsEditOpen(false);
      resetForm();
      fetchBusinesses();
    } catch (err) {
      if (!err.response) {
        // Backend offline mock edit
        const mockImages = images.map((img) => {
          if (img instanceof File) {
            return URL.createObjectURL(img);
          }
          return img;
        });
        const updated = businesses.map((b) => 
          b.id === currentBusiness.id ? { ...b, name, category, address, phone, website, images: mockImages, status } : b
        );
        saveLocalBusinesses(updated);
        dispatch(addToast({ type: 'success', message: 'Demo Mode: Business updated successfully!' }));
        setIsEditOpen(false);
        resetForm();
      } else {
        const errMsg = err.response?.data?.error?.message || 'Failed to update business';
        dispatch(addToast({ type: 'error', message: errMsg }));
      }
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this business?')) return;

    try {
      await api.delete(`/api/businesses/${id}`);
      dispatch(addToast({ type: 'success', message: 'Business deleted successfully!' }));
      fetchBusinesses();
    } catch (err) {
      if (!err.response) {
        // Backend offline mock delete
        const updated = businesses.filter((b) => b.id !== id);
        saveLocalBusinesses(updated);
        dispatch(addToast({ type: 'success', message: 'Demo Mode: Business deleted successfully!' }));
      } else {
        dispatch(addToast({ type: 'error', message: 'Failed to delete business' }));
      }
    }
  };

  // Filter & Search
  const filteredBusinesses = businesses.filter((b) => {
    const matchesSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'All' || b.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  // Extract unique categories for filter
  const categories = ['All', ...new Set(businesses.map((b) => b.category))];

  return (
    <div className="flex flex-col gap-6 w-full pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Businesses</h1>
          <p className="text-xs text-textSecondary">Add and manage local business profiles.</p>
        </div>
        <Button variant="primary" icon={Plus} onClick={() => { resetForm(); setIsCreateOpen(true); }}>
          Add Business
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card>
        <Card.Content className="flex flex-col md:flex-row md:items-center gap-4 py-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textSecondary" />
            <input
              type="text"
              placeholder="Search by name, category or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg bg-white/[0.04] border border-white/10 text-white placeholder-textSecondary/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
            />
          </div>
          <div className="w-full md:w-48 relative">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-4 py-2.5 text-sm rounded-lg bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all cursor-pointer"
              style={{ colorScheme: 'dark' }}
            >
              {categories.map((c, i) => (
                <option key={i} value={c} style={{ background: '#0F0F17', color: '#FFF' }}>{c}</option>
              ))}
            </select>
          </div>
        </Card.Content>
      </Card>

      {/* Grid List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <Card key={n} className="animate-pulse">
              <div className="h-40 bg-white/[0.04] rounded-t-xl" />
              <Card.Content className="flex flex-col gap-3 py-4">
                <div className="h-4 w-1/2 bg-white/[0.06] rounded" />
                <div className="h-3 w-3/4 bg-white/[0.04] rounded" />
                <div className="h-3 w-1/4 bg-white/[0.04] rounded" />
              </Card.Content>
            </Card>
          ))}
        </div>
      ) : filteredBusinesses.length === 0 ? (
        <EmptyState
          title="No businesses found"
          description="Get started by adding a new local business to manage."
          actionLabel="Add Business"
          onAction={() => { resetForm(); setIsCreateOpen(true); }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBusinesses.map((biz) => (
            <Card key={biz.id} className="group overflow-hidden flex flex-col justify-between border-white/[0.06] hover:border-primary/30 transition-all duration-300">
              <div>
                {/* Images display */}
                <div className="h-44 w-full bg-white/[0.02] relative overflow-hidden flex items-center justify-center border-b border-white/[0.06]">
                  {biz.images && biz.images.length > 0 ? (
                    <img
                      src={biz.images[0]}
                      alt={biz.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-1.5 text-textSecondary/40">
                      <Building className="w-10 h-10" />
                      <span className="text-[9px] uppercase font-bold tracking-widest">No Image</span>
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <Badge variant={biz.status === 'ACTIVE' ? 'success' : 'neutral'}>
                      {biz.status}
                    </Badge>
                  </div>
                </div>

                <Card.Content className="py-4 flex flex-col gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">{biz.category}</span>
                    <h3 className="text-base font-bold text-white leading-tight mt-0.5">{biz.name}</h3>
                  </div>

                  <div className="flex flex-col gap-1.5 text-xs text-textSecondary">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 shrink-0 text-textSecondary/70" />
                      <span className="truncate">{biz.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 shrink-0 text-textSecondary/70" />
                      <span>{biz.phone}</span>
                    </div>
                    {biz.website && (
                      <div className="flex items-center gap-2">
                        <Globe className="w-3.5 h-3.5 shrink-0 text-textSecondary/50 group-hover:text-primary transition-colors" />
                        <span className="truncate">{biz.website}</span>
                      </div>
                    )}
                  </div>
                </Card.Content>
              </div>

              {/* Action Footer */}
              <div className="px-5 py-3.5 bg-white/[0.02] border-t border-white/[0.06] flex items-center justify-between gap-2.5 rounded-b-[20px]">
                <button
                  onClick={() => setSelected(biz.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                    selectedBusinessId === biz.id
                      ? 'bg-primary/15 border-primary/40 text-purple-300'
                      : 'bg-white/[0.04] border-white/10 text-textSecondary hover:border-primary/30 hover:text-white'
                  }`}
                  title="Select this business"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {selectedBusinessId === biz.id ? 'Selected' : 'Select'}
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(biz)}
                    className="p-1.5 rounded-lg border border-white/10 bg-white/[0.04] text-textSecondary hover:text-white hover:border-primary/30 transition-all"
                    title="Edit Business"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(biz.id)}
                    className="p-1.5 rounded-lg border border-white/10 bg-white/[0.04] text-textSecondary hover:text-red-400 hover:border-red-500/30 transition-all"
                    title="Delete Business"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add Business Modal */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Add Local Business">
        <form onSubmit={handleCreateSubmit} className="flex flex-col gap-4">
          <Input label="Business Name *" type="text" placeholder="e.g. Trendora Bakery" icon={Building} value={name} onChange={(e) => setName(e.target.value)} required />
          <Input label="Category *" type="text" placeholder="e.g. Restaurant, Bakery, Retail" icon={Building} value={category} onChange={(e) => setCategory(e.target.value)} required />
          <Input label="Address *" type="text" placeholder="Street Address, City, State" icon={MapPin} value={address} onChange={(e) => setAddress(e.target.value)} required />
          <Input label="Phone Number *" type="text" placeholder="e.g. 555-0199" icon={Phone} value={phone} onChange={(e) => setPhone(e.target.value)} required />
          <Input label="Website Address" type="text" placeholder="e.g. trendorabakery.com" icon={Globe} value={website} onChange={(e) => setWebsite(e.target.value)} />
          
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-textSecondary">Upload Images</label>
            <div className="flex items-center justify-center border-2 border-dashed border-border hover:border-primary/30 rounded-xl p-6 transition-all relative cursor-pointer">
              <input type="file" multiple accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageChange} />
              <div className="flex flex-col items-center gap-1.5 text-textSecondary">
                <ImageIcon className="w-6 h-6 text-primary" />
                <span className="text-xs">Drag and drop images or click to upload</span>
                <span className="text-[10px] text-slate-400">Max size: 2MB per image</span>
              </div>
            </div>
            {/* Image Preview Grid */}
            {images.length > 0 && (
              <div className="grid grid-cols-4 gap-3 mt-2">
                {images.map((img, idx) => {
                  const previewUrl = typeof img === 'string' ? img : URL.createObjectURL(img);
                  return (
                    <div key={idx} className="relative aspect-square rounded-lg border overflow-hidden bg-slate-50">
                      <img src={previewUrl} alt="preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeSelectedImage(idx)}
                        className="absolute top-1 right-1 p-0.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-all"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-white/[0.06] pt-4 mt-2">
            <span className="text-xs text-textSecondary font-semibold">Status</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStatus('ACTIVE')}
                className={`px-3.5 py-1.5 text-xs rounded-lg border transition-all duration-200 ${
                  status === 'ACTIVE' 
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-bold shadow-[0_0_12px_rgba(16,185,129,0.15)]' 
                    : 'bg-white/[0.02] border-white/10 text-textSecondary hover:border-white/20 hover:text-white'
                }`}
              >
                Active
              </button>
              <button
                type="button"
                onClick={() => setStatus('INACTIVE')}
                className={`px-3.5 py-1.5 text-xs rounded-lg border transition-all duration-200 ${
                  status === 'INACTIVE' 
                    ? 'bg-white/[0.06] border-white/20 text-white font-bold' 
                    : 'bg-white/[0.02] border-white/10 text-textSecondary hover:border-white/20 hover:text-white'
                }`}
              >
                Inactive
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-4 border-t border-white/[0.06] pt-4">
            <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
            <Button type="submit">Create Profile</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Business Modal */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Local Business">
        <form onSubmit={handleEditSubmit} className="flex flex-col gap-4">
          <Input label="Business Name *" type="text" icon={Building} value={name} onChange={(e) => setName(e.target.value)} required />
          <Input label="Category *" type="text" icon={Building} value={category} onChange={(e) => setCategory(e.target.value)} required />
          <Input label="Address *" type="text" icon={MapPin} value={address} onChange={(e) => setAddress(e.target.value)} required />
          <Input label="Phone Number *" type="text" icon={Phone} value={phone} onChange={(e) => setPhone(e.target.value)} required />
          <Input label="Website Address" type="text" icon={Globe} value={website} onChange={(e) => setWebsite(e.target.value)} />
          
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-textSecondary">Upload Images</label>
            <div className="flex items-center justify-center border-2 border-dashed border-border hover:border-primary/30 rounded-xl p-6 transition-all relative cursor-pointer">
              <input type="file" multiple accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageChange} />
              <div className="flex flex-col items-center gap-1.5 text-textSecondary">
                <ImageIcon className="w-6 h-6 text-primary" />
                <span className="text-xs">Drag and drop images or click to upload</span>
              </div>
            </div>
            {/* Image Preview Grid */}
            {images.length > 0 && (
              <div className="grid grid-cols-4 gap-3 mt-2">
                {images.map((img, idx) => {
                  const previewUrl = typeof img === 'string' ? img : URL.createObjectURL(img);
                  return (
                    <div key={idx} className="relative aspect-square rounded-lg border overflow-hidden bg-slate-50">
                      <img src={previewUrl} alt="preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeSelectedImage(idx)}
                        className="absolute top-1 right-1 p-0.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-all"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-white/[0.06] pt-4 mt-2">
            <span className="text-xs text-textSecondary font-semibold">Status</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStatus('ACTIVE')}
                className={`px-3.5 py-1.5 text-xs rounded-lg border transition-all duration-200 ${
                  status === 'ACTIVE' 
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-bold shadow-[0_0_12px_rgba(16,185,129,0.15)]' 
                    : 'bg-white/[0.02] border-white/10 text-textSecondary hover:border-white/20 hover:text-white'
                }`}
              >
                Active
              </button>
              <button
                type="button"
                onClick={() => setStatus('INACTIVE')}
                className={`px-3.5 py-1.5 text-xs rounded-lg border transition-all duration-200 ${
                  status === 'INACTIVE' 
                    ? 'bg-white/[0.06] border-white/20 text-white font-bold' 
                    : 'bg-white/[0.02] border-white/10 text-textSecondary hover:border-white/20 hover:text-white'
                }`}
              >
                Inactive
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-4 border-t border-white/[0.06] pt-4">
            <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Businesses;
