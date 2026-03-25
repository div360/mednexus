import type { InputHTMLAttributes, ReactNode } from 'react';

export type ThemeMode = 'dark' | 'light';
export type SidebarState = 'expanded' | 'collapsed';

export interface ColumnDef<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => ReactNode;
  className?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  keyExtractor: (item: T) => string;
  className?: string;
  onRowClick?: (item: T) => void;
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}
