import * as React from 'react';
import type { ReactNode } from 'react';
import type { ColumnDef, DataTableProps } from '@mednexus/shared/types';
import { cn } from './utils';

export type { ColumnDef, DataTableProps };

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  className,
  onRowClick,
}: DataTableProps<T>) {
  return (
    <div className={cn('w-full overflow-auto', className)}>
      <table className="w-full text-sm text-left">
        <thead className="text-xs uppercase bg-white/5 text-gray-400 font-medium tracking-wider">
          <tr>
            {columns.map((col, idx) => (
              <th
                key={idx}
                scope="col"
                className={cn('px-6 py-4', col.className)}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {data.map((item) => (
            <tr
              key={keyExtractor(item)}
              className={cn(
                'hover:bg-white/[0.02] transition-colors group',
                onRowClick ? 'cursor-pointer' : ''
              )}
              onClick={onRowClick ? () => onRowClick(item) : undefined}
            >
              {columns.map((col, colIdx) => (
                <td
                  key={colIdx}
                  className={cn('px-6 py-4 whitespace-nowrap text-gray-200 group-hover:text-white transition-colors', col.className)}
                >
                  {col.cell
                    ? col.cell(item)
                    : col.accessorKey
                    ? (item[col.accessorKey] as ReactNode)
                    : null}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          No records found.
        </div>
      )}
    </div>
  );
}
