import React, { useState, useEffect } from 'react';
import api from '../services/api';

const categoryIcons = { 'Marketing': '📢', 'Design': '🎨', 'SEO': '🔍', 'Social Media': '📱', 'Analytics': '📊', 'Consulting': '💼', 'Other': '⚙️' };

const PACKAGE_COLORS = {
  Basic: { bg: '#F0F4FF', border: '#6D5EF8', badge: '#E8E4FF', text: '#5B4FE0' },
  Pro: { bg: '#F0FFF4', border: '#22C55E', badge: '#DCFCE7', text: '#16A34A' },
  Premium: { bg: '#FFFBF0', border: '#F59E0B', badge: '#FEF3C7', text: '#D97706' }
};

export default function Services() {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [packages, setPackages] = useState([]);
  const [tab, setTab] = useState('services');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showCatModal, setShowCatModal] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', price: '', duration: '', categoryId: '', packageId: '' });
  const [catForm, setCatForm] = useState({ name: '', description: '' });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const [sRes, cRes, pRes] = await Promise.all([
        api.get('/api/services'),
        api.get('/api/services/categories'),
        api.get('/api/services/packages')
      ]);
      setServices(sRes.data.data || []);
      setCategories(cRes.data.data || []);
      setPackages(pRes.data.data || []);
    } catch { setError('Failed to load data'); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/api/services/${editId}`, form);
      } else {
        await api.post('/api/services', form);
      }
      setShowModal(false);
      setEditId(null);
      setForm({ name: '', description: '', price: '', duration: '', categoryId: '', packageId: '' });
      load();
    } catch { setError('Failed to save service'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this service?')) return;
    try { await api.delete(`/api/services/${id}`); load(); }
    catch { setError('Failed to delete service'); }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try { await api.post('/api/services/categories', catForm); setShowCatModal(false); setCatForm({ name: '', description: '' }); load(); }
    catch { setError('Failed to add category'); }
  };

  const openEdit = (svc) => {
    setEditId(svc.id);
    setForm({ name: svc.name, description: svc.description || '', price: svc.price, duration: svc.duration, categoryId: svc.categoryId, packageId: svc.packageId || '' });
    setShowModal(true);
  };

  return (
    <div style={{ padding: '32px', background: '#F8FAFC', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#0F172A', margin: 0 }}>Services Management</h1>
          <p style={{ color: '#64748B', marginTop: '4px', fontSize: '14px' }}>Manage your service catalog, categories, and pricing packages</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => setShowCatModal(true)} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #E2E8F0', background: '#fff', color: '#374151', fontWeight: 600, cursor: 'pointer', fontSize: '14px' }}>
            + Add Category
          </button>
          <button onClick={() => { setEditId(null); setForm({ name: '', description: '', price: '', duration: '', categoryId: '', packageId: '' }); setShowModal(true); }} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#6D5EF8', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '14px' }}>
            + Add Service
          </button>
        </div>
      </div>

      {error && <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', background: '#F1F5F9', borderRadius: '10px', padding: '4px', marginBottom: '28px', width: 'fit-content' }}>
        {['services', 'categories', 'packages'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: '8px 20px', borderRadius: '7px', border: 'none', background: tab === t ? '#fff' : 'transparent', color: tab === t ? '#6D5EF8' : '#64748B', fontWeight: tab === t ? 600 : 500, cursor: 'pointer', fontSize: '14px', boxShadow: tab === t ? '0 1px 4px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.2s', textTransform: 'capitalize' }}>
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#94A3B8' }}>Loading...</div>
      ) : (
        <>
          {/* Services Tab */}
          {tab === 'services' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
              {services.length === 0 ? (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px', color: '#94A3B8' }}>
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>🛠️</div>
                  <p style={{ fontSize: '16px', fontWeight: 500 }}>No services yet</p>
                  <p style={{ fontSize: '14px' }}>Add your first service to get started</p>
                </div>
              ) : services.map(svc => (
                <div key={svc.id} style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid #E2E8F0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', transition: 'all 0.2s' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div>
                      <div style={{ fontSize: '28px', marginBottom: '8px' }}>{categoryIcons[svc.category?.name] || '⚙️'}</div>
                      <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', margin: 0 }}>{svc.name}</h3>
                      <p style={{ fontSize: '13px', color: '#64748B', marginTop: '4px' }}>{svc.category?.name || 'Uncategorized'}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '22px', fontWeight: 700, color: '#6D5EF8' }}>${svc.price}</div>
                      <div style={{ fontSize: '12px', color: '#94A3B8' }}>{svc.duration} min</div>
                    </div>
                  </div>
                  {svc.description && <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '16px', lineHeight: '1.5' }}>{svc.description}</p>}
                  {svc.package && (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#E8E4FF', color: '#6D5EF8', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, marginBottom: '16px' }}>
                      📦 {svc.package.name} Package
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #F1F5F9', paddingTop: '16px' }}>
                    <button onClick={() => openEdit(svc)} style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid #E2E8F0', background: '#fff', color: '#374151', fontWeight: 600, cursor: 'pointer', fontSize: '13px' }}>Edit</button>
                    <button onClick={() => handleDelete(svc.id)} style={{ flex: 1, padding: '8px', borderRadius: '8px', border: 'none', background: '#FEF2F2', color: '#DC2626', fontWeight: 600, cursor: 'pointer', fontSize: '13px' }}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Categories Tab */}
          {tab === 'categories' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
              {categories.length === 0 ? (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px', color: '#94A3B8' }}>
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>📂</div>
                  <p>No categories yet. Add one to organize your services.</p>
                </div>
              ) : categories.map(cat => (
                <div key={cat.id} style={{ background: '#fff', borderRadius: '12px', padding: '20px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                  <div style={{ fontSize: '28px', marginBottom: '8px' }}>{categoryIcons[cat.name] || '📁'}</div>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', margin: '0 0 6px' }}>{cat.name}</h3>
                  {cat.description && <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>{cat.description}</p>}
                </div>
              ))}
            </div>
          )}

          {/* Packages Tab */}
          {tab === 'packages' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
              {packages.length === 0 ? (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px', color: '#94A3B8' }}>
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>📦</div>
                  <p>No packages yet. Create service bundles for your clients.</p>
                </div>
              ) : packages.map(pkg => {
                const colors = PACKAGE_COLORS[pkg.name] || PACKAGE_COLORS.Basic;
                return (
                  <div key={pkg.id} style={{ background: colors.bg, borderRadius: '16px', padding: '28px', border: `2px solid ${colors.border}`, boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
                    <div style={{ display: 'inline-flex', background: colors.badge, color: colors.text, padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, marginBottom: '16px', textTransform: 'uppercase' }}>{pkg.name}</div>
                    <div style={{ fontSize: '36px', fontWeight: 800, color: colors.text, marginBottom: '4px' }}>${pkg.price}<span style={{ fontSize: '16px', fontWeight: 400, color: '#64748B' }}>/mo</span></div>
                    {pkg.description && <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '16px' }}>{pkg.description}</p>}
                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px' }}>
                      {(pkg.services || []).map(svc => (
                        <li key={svc.id} style={{ fontSize: '13px', color: '#374151', padding: '4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ color: colors.text }}>✓</span> {svc.name}
                        </li>
                      ))}
                    </ul>
                    <button style={{ width: '100%', padding: '12px', borderRadius: '10px', border: 'none', background: colors.border, color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: '14px' }}>
                      Select {pkg.name}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Add/Edit Service Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '32px', width: '480px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0F172A', marginBottom: '24px' }}>{editId ? 'Edit Service' : 'Add New Service'}</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[['name', 'Service Name', 'text'], ['description', 'Description', 'text'], ['price', 'Price ($)', 'number'], ['duration', 'Duration (minutes)', 'number']].map(([field, label, type]) => (
                <div key={field}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>{label}</label>
                  <input type={type} value={form[field]} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))} required={field !== 'description'} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              ))}
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>Category</label>
                <select value={form.categoryId} onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))} required style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '14px', outline: 'none' }}>
                  <option value="">Select category...</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>Package (Optional)</label>
                <select value={form.packageId} onChange={e => setForm(f => ({ ...f, packageId: e.target.value }))} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '14px', outline: 'none' }}>
                  <option value="">No package</option>
                  {packages.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', gap: '12px', paddingTop: '8px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '11px', borderRadius: '8px', border: '1px solid #E2E8F0', background: '#fff', color: '#374151', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ flex: 1, padding: '11px', borderRadius: '8px', border: 'none', background: '#6D5EF8', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>Save Service</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {showCatModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '32px', width: '400px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0F172A', marginBottom: '24px' }}>Add Category</h2>
            <form onSubmit={handleAddCategory} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[['name', 'Category Name'], ['description', 'Description (optional)']].map(([field, label]) => (
                <div key={field}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>{label}</label>
                  <input value={catForm[field]} onChange={e => setCatForm(f => ({ ...f, [field]: e.target.value }))} required={field === 'name'} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              ))}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="button" onClick={() => setShowCatModal(false)} style={{ flex: 1, padding: '11px', borderRadius: '8px', border: '1px solid #E2E8F0', background: '#fff', color: '#374151', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ flex: 1, padding: '11px', borderRadius: '8px', border: 'none', background: '#6D5EF8', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>Add Category</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
