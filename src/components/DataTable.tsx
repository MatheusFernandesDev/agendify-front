"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { MobileCard } from "./MobileCard";

interface DataTableProps<T> {
  columns: string[];
  data: T[];
  renderRow: (item: T) => React.ReactNode;
  renderMobileCard?: (item: T, index: number) => React.ReactNode;
}

export function DataTable<T>({ columns, data, renderRow, renderMobileCard }: DataTableProps<T>) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Mobile view - Cards
  if (isMobile) {
    if (data.length === 0) {
      return (
        <div className="text-center py-12 text-gray-500">
          Nenhum registro encontrado.
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {data.map((item, index) => (
          <MobileCard key={index}>
            {renderMobileCard ? renderMobileCard(item, index) : renderRow(item)}
          </MobileCard>
        ))}
      </div>
    );
  }

  // Desktop view - Table
  return (
    <div className="rounded-md border border-gray-100 overflow-x-auto">
      <Table>
        <TableHeader className="bg-gray-50/50">
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col} className="text-gray-600 font-semibold py-4">
                {col}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((item, index) => (
              <TableRow key={index} className="hover:bg-gray-50/50 transition-colors">
                {renderRow(item)}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center text-gray-500">
                Nenhum registro encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}