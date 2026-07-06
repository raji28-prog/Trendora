import React, { useState, useEffect } from 'react';
import Card from '../components/UI/Card.jsx';
import Table from '../components/UI/Table.jsx';
import Badge from '../components/UI/Badge.jsx';
import EmptyState from '../components/UI/EmptyState.jsx';
import { addToast } from '../store/uiSlice.js';
import { useDispatch } from 'react-redux';
import { Search, Mail, Phone, UserCheck } from 'lucide-react';
import api from '../services/api.js';

export const Leads = () => {
  const dispatch = useDispatch();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/leads');
      setLeads(response.data.data || []);
    } catch (err) {
      if (!err.response) {
        const local = localStorage.getItem('demo_leads');
        if (local) {
          setLeads(JSON.parse(local));
        } else {
          const defaultLeads = [
            { id: 'lead-1', firstName: 'Alice', lastName: 'Smith', email: 'alice@example.com', phone: '555-0123', status: 'NEW', source: 'Summer Local Loyalty Drive' },
            { id: 'lead-2', firstName: 'Bob', lastName: 'Johnson', email: 'bob@example.com', phone: '555-0145', status: 'QUALIFIED', source: 'SMS Discount Blast' }
          ];
          localStorage.setItem('demo_leads', JSON.stringify(defaultLeads));
          setLeads(defaultLeads);
        }
      } else {
        dispatch(addToast({ type: 'error', message: 'Failed to fetch leads' }));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const filteredLeads = leads.filter(l => 
    `${l.firstName} ${l.lastName || ''}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 w-full">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-textPrimary">Customer Leads</h1>
        <p className="text-xs text-textSecondary">Manage and capture new prospect contacts from campaigns.</p>
      </div>

      <Card>
        <Card.Content className="flex items-center gap-4 py-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textSecondary" />
            <input
              type="text"
              placeholder="Search leads by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-lg bg-background text-textPrimary focus:outline-none focus:border-primary"
            />
          </div>
        </Card.Content>
      </Card>

      {filteredLeads.length === 0 ? (
        <EmptyState title="No Leads captured" description="Leads will automatically appear here when prospects interact with your live promotions." />
      ) : (
        <Card>
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell>Email</Table.HeaderCell>
                <Table.HeaderCell>Phone</Table.HeaderCell>
                <Table.HeaderCell>Campaign Source</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {filteredLeads.map((lead) => (
                <Table.Row key={lead.id}>
                  <Table.Cell className="font-semibold text-textPrimary">{lead.firstName} {lead.lastName}</Table.Cell>
                  <Table.Cell className="text-textSecondary">{lead.email}</Table.Cell>
                  <Table.Cell className="text-textSecondary">{lead.phone || '-'}</Table.Cell>
                  <Table.Cell className="text-textSecondary">{lead.source || 'Organic'}</Table.Cell>
                  <Table.Cell>
                    <Badge variant={lead.status === 'QUALIFIED' ? 'success' : lead.status === 'NEW' ? 'primary' : 'neutral'}>
                      {lead.status}
                    </Badge>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Card>
      )}
    </div>
  );
};

export default Leads;
