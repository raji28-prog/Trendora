import React from 'react';

export const Table = ({ children, className = '', ...props }) => (
  <div className="w-full overflow-x-auto rounded-[20px] border border-white/[0.06]"
    style={{
      background: 'rgba(15, 15, 23, 0.7)',
      backdropFilter: 'blur(20px)',
      boxShadow: '0 4px 24px -4px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)',
    }}
  >
    <table className={`w-full text-sm text-left text-textPrimary ${className}`} {...props}>
      {children}
    </table>
  </div>
);

export const TableHeader = ({ children, className = '', ...props }) => (
  <thead
    className={`border-b border-white/[0.06] text-[11px] font-semibold text-textSecondary uppercase tracking-wider ${className}`}
    style={{ background: 'rgba(255,255,255,0.02)' }}
    {...props}
  >
    {children}
  </thead>
);

export const TableBody = ({ children, className = '', ...props }) => (
  <tbody className={`divide-y divide-white/[0.04] ${className}`} {...props}>
    {children}
  </tbody>
);

export const TableRow = ({ children, className = '', ...props }) => (
  <tr
    className={`hover:bg-white/[0.03] transition-colors duration-150 group ${className}`}
    {...props}
  >
    {children}
  </tr>
);

export const TableHead = ({ children, className = '', ...props }) => (
  <th className={`px-6 py-4 font-semibold text-textSecondary ${className}`} {...props}>
    {children}
  </th>
);

export const TableCell = ({ children, className = '', ...props }) => (
  <td className={`px-6 py-4 text-textPrimary ${className}`} {...props}>
    {children}
  </td>
);

Table.Header = TableHeader;
Table.Body   = TableBody;
Table.Row    = TableRow;
Table.Head   = TableHead;
Table.HeaderCell = TableHead;
Table.Cell   = TableCell;

export default Table;
