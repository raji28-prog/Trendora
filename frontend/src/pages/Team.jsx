import React, { useState, useEffect } from 'react';
import api from '../services/api';

const ROLES = ['ADMIN', 'MANAGER', 'EDITOR'];
const ROLE_COLORS = { ADMIN: { bg: '#FEF2F2', color: '#DC2626', border: '#FECACA' }, MANAGER: { bg: '#FFF8F0', color: '#D97706', border: '#FDE68A' }, EDITOR: { bg: '#EFF6FF', color: '#2563EB', border: '#BFDBFE' } };

export default function Team() {
  const [members, setMembers] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', role: 'EDITOR', businessId: '' });
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const [tRes, bRes] = await Promise.all([api.get('/api/team'), api.get('/api/businesses')]);
      setMembers(tRes.data.data || []);
      setBusinesses(bRes.data.data || []);
    } catch { setError('Failed to load team'); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/api/team/${editId}`, form);
      } else {
        await api.post('/api/team', form);
      }
      setShowModal(false);
      setEditId(null);
      setForm({ name: '', email: '', role: 'EDITOR', businessId: '' });
      load();
    } catch { setError('Failed to save team member'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this team member?')) return;
    try { await api.delete(`/api/team/${id}`); load(); }
    catch { setError('Failed to remove member'); }
  };

  const openEdit = (m) => {
    setEditId(m.id);
    setForm({ name: m.name, email: m.email, role: m.role, businessId: m.businessId });
    setShowModal(true);
  };

  const roleCounts = ROLES.reduce((acc, r) => ({ ...acc, [r]: members.filter(m => m.role === r).length }), {});

  return (
    <div style={{ padding: '32px', background: '#F8FAFC', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#0F172A', margin: 0 }}>Team Management</h1>
          <p style={{ color: '#64748B', marginTop: '4px', fontSize: '14px' }}>Manage collaborators and control their access permissions</p>
        </div>
        <button onClick={() => { setEditId(null); setForm({ name: '', email: '', role: 'EDITOR', businessId: '' }); setShowModal(true); }} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#6D5EF8', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '14px' }}>
          + Invite Member
        </button>
      </div>

      {error && <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}

      {/* Role Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '28px' }}>
        {ROLES.map(role => {
          const c = ROLE_COLORS[role];
          return (
            <div key={role} style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: c.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
                {role === 'ADMIN' ? '👑' : role === 'MANAGER' ? '📋' : '✏️'}
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: c.color }}>{roleCounts[role]}</div>
                <div style={{ fontSize: '13px', color: '#64748B', fontWeight: 500 }}>{role.charAt(0) + role.slice(1).toLowerCase()}s</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Members List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#94A3B8' }}>Loading...</div>
      ) : members.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px', background: '#fff', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>👥</div>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A' }}>No Team Members Yet</h3>
          <p style={{ color: '#64748B' }}>Invite collaborators to help manage your business</p>
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                {['Member', 'Email', 'Role', 'Joined', 'Actions'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '14px 20px', fontSize: '12px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {members.map(member => {
                const c = ROLE_COLORS[member.role] || ROLE_COLORS.EDITOR;
                return (
                  <tr key={member.id} style={{ borderBottom: '1px solid #F1F5F9', transition: 'background 0.15s' }} onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#E8E4FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 700, color: '#6D5EF8', flexShrink: 0 }}>
                        {member.name?.charAt(0).toUpperCase()}
                      </div>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A' }}>{member.name}</span>
                    </td>
                    <td style={{ padding: '16px 20px', fontSize: '14px', color: '#64748B' }}>{member.email}</td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, padding: '4px 12px', borderRadius: '20px', background: c.bg, color: c.color, border: `1px solid ${c.border}` }}>{member.role}</span>
                    </td>
                    <td style={{ padding: '16px 20px', fontSize: '13px', color: '#94A3B8' }}>{new Date(member.createdAt).toLocaleDateString()}</td>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => openEdit(member)} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #E2E8F0', background: '#fff', color: '#374151', fontWeight: 600, cursor: 'pointer', fontSize: '12px' }}>Edit</button>
                        <button onClick={() => handleDelete(member.id)} style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', background: '#FEF2F2', color: '#DC2626', fontWeight: 600, cursor: 'pointer', fontSize: '12px' }}>Remove</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '32px', width: '420px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0F172A', marginBottom: '24px' }}>{editId ? 'Edit Member' : 'Invite Team Member'}</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[['name', 'Full Name'], ['email', 'Email Address']].map(([field, label]) => (
                <div key={field}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>{label}</label>
                  <input type={field === 'email' ? 'email' : 'text'} value={form[field]} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))} required style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              ))}
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '8px' }}>Role</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {ROLES.map(role => {
                    const c = ROLE_COLORS[role];
                    return (
                      <button type="button" key={role} onClick={() => setForm(f => ({ ...f, role }))} style={{ padding: '10px 8px', borderRadius: '8px', border: `2px solid ${form.role === role ? c.color : '#E2E8F0'}`, background: form.role === role ? c.bg : '#fff', color: form.role === role ? c.color : '#64748B', fontWeight: 700, cursor: 'pointer', fontSize: '12px' }}>
                        {role === 'ADMIN' ? '👑' : role === 'MANAGER' ? '📋' : '✏️'}<br />{role}
                      </button>
                    );
                  })}
                </div>
              </div>
              {businesses.length > 0 && (
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>Business</label>
                  <select value={form.businessId} onChange={e => setForm(f => ({ ...f, businessId: e.target.value }))} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '14px', outline: 'none' }}>
                    <option value="">Auto-select first business</option>
                    {businesses.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
              )}
              <div style={{ display: 'flex', gap: '12px', paddingTop: '8px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '11px', borderRadius: '8px', border: '1px solid #E2E8F0', background: '#fff', color: '#374151', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ flex: 1, padding: '11px', borderRadius: '8px', border: 'none', background: '#6D5EF8', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>{editId ? 'Save Changes' : 'Send Invite'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
