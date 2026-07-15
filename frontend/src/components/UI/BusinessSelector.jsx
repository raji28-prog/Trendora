import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, ChevronDown, Plus } from 'lucide-react';
import { useSelectedBusiness } from '../../store/useSelectedBusiness.js';

/**
 * BusinessSelector — lives in the DashboardLayout header.
 *
 * Behaviour:
 *   0 businesses → "Add Business" link to /businesses
 *   1 business   → auto-selected, shows name badge (not a dropdown)
 *   2+ businesses → compact dropdown to switch active business
 */
export default function BusinessSelector() {
  const navigate = useNavigate();
  const { businesses, selectedBusinessId, selectedBusiness, setSelected } = useSelectedBusiness();

  const baseStyle = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    backdropFilter: 'blur(8px)',
  };

  // Zero businesses
  if (businesses.length === 0) {
    return (
      <button
        onClick={() => navigate('/businesses')}
        className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-[10px] transition-all"
        style={{
          background: 'rgba(124,58,237,0.08)',
          border: '1px dashed rgba(124,58,237,0.35)',
          color: '#8B5CF6',
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(124,58,237,0.12)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(124,58,237,0.08)'}
      >
        <Plus className="w-3.5 h-3.5" />
        Add Business
      </button>
    );
  }

  // Single business — just a label
  if (businesses.length === 1) {
    const biz = businesses[0];
    return (
      <div
        className="flex items-center gap-2 px-3.5 py-2 rounded-[10px] text-xs"
        style={baseStyle}
      >
        <div
          className="w-5 h-5 rounded-[6px] flex items-center justify-center shrink-0"
          style={{
            background: 'rgba(124,58,237,0.15)',
            border: '1px solid rgba(124,58,237,0.25)',
          }}
        >
          <Building className="w-3 h-3" style={{ color: '#8B5CF6' }} />
        </div>
        <span className="font-semibold text-white max-w-[140px] truncate">{biz.name}</span>
      </div>
    );
  }

  // Multiple businesses — native select
  return (
    <div className="relative flex items-center">
      <div
        className="flex items-center gap-1.5 px-3.5 py-2 rounded-[10px] text-xs cursor-pointer transition-colors"
        style={baseStyle}
      >
        <Building className="w-3.5 h-3.5 shrink-0" style={{ color: '#8B5CF6' }} />
        <select
          value={selectedBusinessId || ''}
          onChange={(e) => setSelected(e.target.value)}
          className="appearance-none bg-transparent pr-4 font-semibold text-white focus:outline-none max-w-[160px] cursor-pointer"
          style={{ WebkitAppearance: 'none' }}
        >
          <option value="" disabled style={{ background: '#0F0F17', color: '#A1A1AA' }}>
            Select Business
          </option>
          {businesses.map((b) => (
            <option key={b.id} value={b.id} style={{ background: '#0F0F17', color: '#FFFFFF' }}>
              {b.name}
            </option>
          ))}
        </select>
        <ChevronDown className="w-3 h-3 text-textSecondary pointer-events-none shrink-0" />
      </div>
    </div>
  );
}
