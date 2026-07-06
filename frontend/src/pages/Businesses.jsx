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
import { Search, Plus, Edit2, Trash2, Globe, Phone, MapPin, Building, ToggleLeft, ToggleRight, X, Image as ImageIcon } from 'lucide-react';
import api from '../services/api.js';

export const Businesses = () => {
  const dispatch = useDispatch();
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

  // Load from API
  const fetchBusinesses = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/businesses');
      setBusinesses(response.data.data || []);
    } catch (err) {
      if (!err.response) {
        // Backend offline: Use local storage mock database
        const local = localStorage.getItem('demo_businesses');
        if (local) {
          setBusinesses(JSON.parse(local));
        } else {
          const defaultDemo = [
            {
              id: 'demo-1',
              name: 'Coffee & Co.',
              category: 'Food & Beverage',
              address: '123 Main St, New York',
              phone: '555-0192',
              website: 'coffeeandco.com',
              images: [],
              status: 'ACTIVE',
              createdAt: new Date().toISOString(),
            },
            {
              id: 'demo-2',
              name: 'Green & Grow Nursery',
              category: 'Retail',
              address: '742 Evergreen Terrace',
              phone: '555-0199',
              website: 'greengrow.com',
              images: [],
              status: 'INACTIVE',
              createdAt: new Date().toISOString(),
            }
          ];
          localStorage.setItem('demo_businesses', JSON.stringify(defaultDemo));
          setBusinesses(defaultDemo);
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
    localStorage.setItem('demo_businesses', JSON.stringify(updated));
  };

  // Image Upload handler (supports multiple file conversion to base64)
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    const loadedImages = [];

    files.forEach((file) => {
      if (file.size > 2 * 1024 * 1024) {
        dispatch(addToast({ type: 'error', message: `${file.name} is too large (>2MB).` }));
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        loadedImages.push(reader.result);
        if (loadedImages.length === files.length) {
          setImages((prev) => [...prev, ...loadedImages]);
        }
      };
      reader.readAsDataURL(file);
    });
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

    const payload = { name, category, address, phone, website, images, status };

    try {
      const response = await api.post('/api/businesses', payload);
      dispatch(addToast({ type: 'success', message: 'Business created successfully!' }));
      setIsCreateOpen(false);
      resetForm();
      fetchBusinesses();
    } catch (err) {
      if (!err.response) {
        // Backend offline mock create
        const newBiz = {
          id: `demo-${Date.now()}`,
          name,
          category,
          address,
          phone,
          website,
          images,
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

    const payload = { name, category, address, phone, website, images, status };

    try {
      await api.put(`/api/businesses/${currentBusiness.id}`, payload);
      dispatch(addToast({ type: 'success', message: 'Business updated successfully!' }));
      setIsEditOpen(false);
      resetForm();
      fetchBusinesses();
    } catch (err) {
      if (!err.response) {
        // Backend offline mock edit
        const updated = businesses.map((b) => 
          b.id === currentBusiness.id ? { ...b, name, category, address, phone, website, images, status } : b
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
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-textPrimary">Businesses</h1>
          <p className="text-xs text-textSecondary">Add and manage local business profiles.</p>
        </div>
        <Button variant="primary" icon={Plus} onClick={() => { resetForm(); setIsCreateOpen(true); }}>
          Add Business
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card>
        <Card.Content className="flex flex-col md:flex-row md:items-center gap-4 py-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textSecondary" />
            <input
              type="text"
              placeholder="Search by name, category or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-lg bg-background text-textPrimary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
            />
          </div>
          <div className="w-full md:w-48">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-surface text-textPrimary focus:outline-none focus:border-primary"
            >
              {categories.map((c, i) => (
                <option key={i} value={c}>{c}</option>
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
              <div className="h-40 bg-slate-100 rounded-t-xl" />
              <Card.Content className="flex flex-col gap-3 py-4">
                <div className="h-4 w-1/2 bg-slate-200 rounded" />
                <div className="h-3 w-3/4 bg-slate-100 rounded" />
                <div className="h-3 w-1/4 bg-slate-100 rounded" />
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
            <Card key={biz.id} className="group overflow-hidden flex flex-col justify-between hover:shadow-premium border-border/80 hover:border-primary/20 transition-all duration-300">
              <div>
                {/* Images display */}
                <div className="h-44 w-full bg-slate-100 relative overflow-hidden flex items-center justify-center border-b border-border">
                  {biz.images && biz.images.length > 0 ? (
                    <img
                      src={biz.images[0]}
                      alt={biz.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-slate-400">
                      <Building className="w-10 h-10" />
                      <span className="text-[10px] uppercase font-bold tracking-wider">No Image</span>
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
                    <span className="text-[10px] font-bold text-primary uppercase tracking-wider">{biz.category}</span>
                    <h3 className="text-base font-bold text-textPrimary leading-tight mt-0.5">{biz.name}</h3>
                  </div>

                  <div className="flex flex-col gap-1.5 text-xs text-textSecondary">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{biz.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 shrink-0" />
                      <span>{biz.phone}</span>
                    </div>
                    {biz.website && (
                      <div className="flex items-center gap-2">
                        <Globe className="w-3.5 h-3.5 shrink-0 text-slate-400 group-hover:text-primary transition-colors" />
                        <span className="truncate">{biz.website}</span>
                      </div>
                    )}
                  </div>
                </Card.Content>
              </div>

              {/* Action Footer */}
              <div className="px-5 py-3.5 bg-sectionBackground/60 border-t border-border/80 flex items-center justify-end gap-2.5">
                <button
                  onClick={() => openEditModal(biz)}
                  className="p-1.5 rounded-lg border border-border bg-white text-textSecondary hover:text-primary hover:border-primary/20 transition-all"
                  title="Edit Business"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(biz.id)}
                  className="p-1.5 rounded-lg border border-border bg-white text-textSecondary hover:text-red-600 hover:border-red-100 transition-all"
                  title="Delete Business"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add Business Modal */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Add Local Business">
        <form onSubmit={handleCreateSubmit} className="flex flex-col gap-4">
          <Input label="Business Name *" type="text" placeholder="e.g. Trendora Bakery" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input label="Category *" type="text" placeholder="e.g. Restaurant, Bakery, Retail" value={category} onChange={(e) => setCategory(e.target.value)} required />
          <Input label="Address *" type="text" placeholder="Street Address, City, State" value={address} onChange={(e) => setAddress(e.target.value)} required />
          <Input label="Phone Number *" type="text" placeholder="e.g. 555-0199" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          <Input label="Website Address" type="text" placeholder="e.g. trendorabakery.com" value={website} onChange={(e) => setWebsite(e.target.value)} />
          
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
                {images.map((img, idx) => (
                  <div key={idx} className="relative aspect-square rounded-lg border overflow-hidden bg-slate-50">
                    <img src={img} alt="preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeSelectedImage(idx)}
                      className="absolute top-1 right-1 p-0.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-all"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-border pt-4 mt-2">
            <span className="text-xs text-textSecondary">Status</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStatus('ACTIVE')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                  status === 'ACTIVE' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-white text-textSecondary border-border'
                }`}
              >
                Active
              </button>
              <button
                type="button"
                onClick={() => setStatus('INACTIVE')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                  status === 'INACTIVE' ? 'bg-slate-100 border-slate-300 text-slate-700' : 'bg-white text-textSecondary border-border'
                }`}
              >
                Inactive
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-4 border-t border-border pt-4">
            <Button type="button" variant="secondary" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Create Profile</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Business Modal */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Local Business">
        <form onSubmit={handleEditSubmit} className="flex flex-col gap-4">
          <Input label="Business Name *" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input label="Category *" type="text" value={category} onChange={(e) => setCategory(e.target.value)} required />
          <Input label="Address *" type="text" value={address} onChange={(e) => setAddress(e.target.value)} required />
          <Input label="Phone Number *" type="text" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          <Input label="Website Address" type="text" value={website} onChange={(e) => setWebsite(e.target.value)} />
          
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
                {images.map((img, idx) => (
                  <div key={idx} className="relative aspect-square rounded-lg border overflow-hidden bg-slate-50">
                    <img src={img} alt="preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeSelectedImage(idx)}
                      className="absolute top-1 right-1 p-0.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-all"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-border pt-4 mt-2">
            <span className="text-xs text-textSecondary">Status</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStatus('ACTIVE')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                  status === 'ACTIVE' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-white text-textSecondary border-border'
                }`}
              >
                Active
              </button>
              <button
                type="button"
                onClick={() => setStatus('INACTIVE')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                  status === 'INACTIVE' ? 'bg-slate-100 border-slate-300 text-slate-700' : 'bg-white text-textSecondary border-border'
                }`}
              >
                Inactive
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-4 border-t border-border pt-4">
            <Button type="button" variant="secondary" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Save Changes</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Businesses;
