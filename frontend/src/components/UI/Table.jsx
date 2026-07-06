import React from 'react';

export const Table = ({ children, className = '', ...props }) => (
  <div className="w-full overflow-x-auto border border-border rounded-xl bg-surface">
    <table className={`w-full text-sm text-left text-textPrimary ${className}`} {...props}>
      {children}
    </table>
  </div>
);

export const TableHeader = ({ children, className = '', ...props }) => (
  <thead className={`bg-background text-xs font-semibold text-textSecondary uppercase border-b border-border ${className}`} {...props}>
    {children}
  </thead>
);

export const TableBody = ({ children, className = '', ...props }) => (
  <tbody className={`divide-y divide-border ${className}`} {...props}>
    {children}
  </tbody>
);

export const TableRow = ({ children, className = '', ...props }) => (
  <tr className={`hover:bg-background/50 transition-colors ${className}`} {...props}>
    {children}
  </tr>
);

export const TableHead = ({ children, className = '', ...props }) => (
  <th className={`px-6 py-4 font-semibold ${className}`} {...props}>
    {children}
  </th>
);

export const TableCell = ({ children, className = '', ...props }) => (
  <td className={`px-6 py-4 ${className}`} {...props}>
    {children}
  </td>
);

Table.Header = TableHeader;
Table.Body = TableBody;
Table.Row = TableRow;
Table.Head = TableHead;
Table.Cell = TableCell;

export default Table;
