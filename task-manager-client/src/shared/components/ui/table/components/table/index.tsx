import React from 'react';

interface TableProps {
  children: React.ReactNode;
}

export const Table: React.FC<TableProps> = ({ children }) => (
  <div className="overflow-x-auto flex-1">
    <table className="w-full text-left border-collapse">{children}</table>
  </div>
);
