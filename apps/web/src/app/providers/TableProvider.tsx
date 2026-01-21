'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

type TableContextType = {
  tableId: string | null;
  setTableId: (id: string | null) => void;
};

const TableContext = createContext<TableContextType | undefined>(undefined);

export function TableProvider({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const [tableId, setTableIdState] = useState<string | null>(null);

  useEffect(() => {
    const fromUrl = searchParams.get('tableId');
    const fromStorage = localStorage.getItem('tableId');

    if (fromUrl) {
      setTableIdState(fromUrl);
      localStorage.setItem('tableId', fromUrl);
    } else if (fromStorage) {
      setTableIdState(fromStorage);
    }
  }, [searchParams]);

  const setTableId = (id: string | null) => {
    if (id) {
      localStorage.setItem('tableId', id);
    } else {
      localStorage.removeItem('tableId');
    }
    setTableIdState(id);
  };

  return (
    <TableContext.Provider value={{ tableId, setTableId }}>
      {children}
    </TableContext.Provider>
  );
}

export function useTable() {
  const ctx = useContext(TableContext);
  if (!ctx) {
    throw new Error('useTable must be used within TableProvider');
  }
  return ctx;
}
