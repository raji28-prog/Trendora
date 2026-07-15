import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Card from '../components/UI/Card.jsx';
import Button from '../components/UI/Button.jsx';
import Badge from '../components/UI/Badge.jsx';
import Spinner from '../components/UI/Spinner.jsx';
import EmptyState from '../components/UI/EmptyState.jsx';
import Table from '../components/UI/Table.jsx';
import Modal from '../components/UI/Modal.jsx';
import Input from '../components/UI/Input.jsx';
import Select from '../components/UI/Select.jsx';
import { Users, Mail, Plus, Edit2, Trash2, Calendar, ShieldCheck, UserPlus } from 'lucide-react';

const ROLES = ['ADMIN', 'MANAGER', 'EDITOR'];
const ROLE_VARIANTS = { ADMIN: 'accent', MANAGER: 'primary', EDITOR: 'neutral' };

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
    <div className="flex flex-col gap-6 w-full pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
            <Users className="w-4 h-4 text-purple-400" /> Collaborator Hub
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Team Management</h1>
          <p className="text-xs text-textSecondary">Manage collaborators and control their access permissions</p>
        </div>
        <Button variant="primary" icon={Plus} onClick={() => { setEditId(null); setForm({ name: '', email: '', role: 'EDITOR', businessId: '' }); setShowModal(true); }}>
          Invite Member
        </Button>
      </div>

      {error && (
        <div className="px-4 py-3 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 text-xs font-semibold">
          {error}
        </div>
      )}

      {/* Role Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {ROLES.map(role => {
          const count = roleCounts[role] || 0;
          return (
            <Card key={role}>
              <Card.Content className="p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-[14px] bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-xl shadow-[0_0_12px_rgba(168,85,247,0.15)]">
                  {role === 'ADMIN' ? '👑' : role === 'MANAGER' ? '📋' : '✏️'}
                </div>
                <div>
                  <div className="text-2xl font-black text-white tracking-tight">{count}</div>
                  <div className="text-[10px] text-textSecondary uppercase tracking-widest font-semibold">{role.charAt(0) + role.slice(1).toLowerCase()}s</div>
                </div>
              </Card.Content>
            </Card>
          );
        })}
      </div>

      {/* Members List */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <Spinner size="lg" />
        </div>
      ) : members.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No Team Members Yet"
          description="Invite collaborators to help manage your business."
        />
      ) : (
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.Head>Member</Table.Head>
              <Table.Head>Email</Table.Head>
              <Table.Head>Role</Table.Head>
              <Table.Head>Joined</Table.Head>
              <Table.Head>Actions</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {members.map(member => (
              <Table.Row key={member.id}>
                <Table.Cell className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-sm font-bold text-white shrink-0 shadow-neon-sm">
                    {member.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-bold text-white text-sm">{member.name}</span>
                </Table.Cell>
                <Table.Cell className="text-textSecondary text-sm">{member.email}</Table.Cell>
                <Table.Cell>
                  <Badge variant={ROLE_VARIANTS[member.role]}>{member.role}</Badge>
                </Table.Cell>
                <Table.Cell className="text-textSecondary/80 text-xs font-semibold">{new Date(member.createdAt).toLocaleDateString()}</Table.Cell>
                <Table.Cell>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEdit(member)}
                      className="p-1.5 rounded-lg border border-white/10 bg-white/[0.04] text-textSecondary hover:text-white hover:border-primary/30 transition-all"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(member.id)}
                      className="p-1.5 rounded-lg border border-white/10 bg-white/[0.04] text-textSecondary hover:text-red-400 hover:border-red-500/30 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}

      {/* Invite Member Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editId ? 'Edit Team Member' : 'Invite Team Member'}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Full Name"
            placeholder="John Doe"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            required
          />
          <Input
            label="Email Address"
            type="email"
            placeholder="john@example.com"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            required
          />
          
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-semibold text-textSecondary uppercase tracking-widest">Role</span>
            <div className="grid grid-cols-3 gap-3">
              {ROLES.map(role => {
                const isSelected = form.role === role;
                return (
                  <button
                    type="button"
                    key={role}
                    onClick={() => setForm(f => ({ ...f, role }))}
                    className={`flex flex-col items-center justify-center p-3 rounded-[12px] border text-xs font-bold transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/15 text-white'
                        : 'border-white/10 bg-white/[0.03] text-textSecondary hover:border-primary/30 hover:text-white'
                    }`}
                  >
                    <span className="text-base mb-1">{role === 'ADMIN' ? '👑' : role === 'MANAGER' ? '📋' : '✏️'}</span>
                    <span>{role}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {businesses.length > 0 && (
            <Select
              label="Assigned Business Listing"
              value={form.businessId}
              onChange={e => setForm(f => ({ ...f, businessId: e.target.value }))}
              options={[{ value: '', label: 'Auto-select first business' }, ...businesses.map(b => ({ value: b.id, label: b.name }))]}
            />
          )}

          <div className="flex gap-3 mt-4">
            <Button variant="outline" className="flex-1" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              {editId ? 'Save Changes' : 'Send Invite'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
