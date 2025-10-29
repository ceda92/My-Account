import React from "react";
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  RowSelectionState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { DataTable } from "./data-table";
import { useEffect, useState } from "react";
import { TableStyleProps } from "./tableTypes";

interface LocalTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  onRowSelect?: (rowId: TData) => void;
  getRowId?: (row: TData) => string;
  tableStyles?: TableStyleProps; // Add styles prop
}

export function LocalTable<TData, TValue>({
  columns,
  data,
  isLoading,
  onRowSelect,
  getRowId,
  tableStyles, // Destructure styles
}: LocalTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  useEffect(() => {
    if (onRowSelect && Object.keys(rowSelection).length) {
      const selectedRows = Object.keys(rowSelection).filter(
        (key) => rowSelection[key]
      );
      const selected = data.find((row) => {
        return (
          getRowId && getRowId(row).toString() === selectedRows[0]?.toString()
        );
      });
      if (selected) {
        onRowSelect(selected);
      }
    }
  }, [rowSelection, data, getRowId, onRowSelect]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableRowSelection: true,
    enableMultiRowSelection: false,
    getRowId,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    state: {
      sorting,
      rowSelection,
      pagination,
    },
  });

  return (
    <DataTable
      columns={columns}
      isLoading={isLoading}
      table={table}
      {...tableStyles} // Spread the style props
    />
  );
}
