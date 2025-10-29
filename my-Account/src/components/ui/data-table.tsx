/* eslint-disable jsx-a11y/no-static-element-interactions */
import {
  ColumnDef,
  flexRender,
  Table as TableType,
} from "@tanstack/react-table";
import React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { cn } from "../MyAccount/lib/utils";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Database,
  Loader,
} from "lucide-react";
import { Button } from "./button";
import { Skeleton } from "../ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

// interface TableSkeletonProps {
//   columns: number;
//   rowCount?: number;
//   skeletonClassName?: string;
// }

// function TableSkeleton({
//   columns,
//   rowCount = 10,
//   skeletonClassName,
// }: TableSkeletonProps) {
//   return (
//     <TableBody>
//       {Array.from({ length: rowCount }).map((_, rowIndex) => (
//         <TableRow key={rowIndex}>
//           {Array.from({ length: columns }).map((_, colIndex) => (
//             <TableCell key={`${rowIndex}-${colIndex}`}>
//               <div
//                 className={cn(
//                   'h-[30px] w-full max-w-[180px] rounded bg-gray-100 animate-pulse',
//                   skeletonClassName,
//                 )}
//               />
//             </TableCell>
//           ))}
//         </TableRow>
//       ))}
//     </TableBody>
//   );
// }

// const AnimatedExpandingRow = ({
//   isExpanded,
//   children,
//   className,
//   ...props
// }) => {
//   // Track previous expansion state to handle animation
//   const [wasExpanded, setWasExpanded] = useState(false);

//   useEffect(() => {
//     if (isExpanded) {
//       setWasExpanded(true);
//     }
//   }, [isExpanded]);

//   // If it was never expanded, don't render anything
//   if (!wasExpanded) {
//     return isExpanded ? children : null;
//   }

//   // Use the animation class from your Tailwind config
//   const animationClass = isExpanded
//     ? 'animate-expand-collapse opacity-100 max-h-[500px]'
//     : 'animate-collapse-expand opacity-0 max-h-0 overflow-hidden';

//   return (
//     <tr
//       className={`${className} transition-all duration-300 ${animationClass}`}
//       {...props}
//     >
//       {children}
//     </tr>
//   );
// };

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  isLoading?: boolean;
  table: TableType<TData>;
  emptyPlacehoder?: React.ReactNode;
  // Style customization props
  containerClassName?: string;
  tableClassName?: string;
  headerRowClassName?: string;
  headerCellClassName?: string;
  sortIconActiveClassName?: string;
  sortIconInactiveClassName?: string;
  bodyRowClassName?: string;
  selectedRowClassName?: string;
  bodyCellClassName?: string;
  noDataClassName?: string;
  paginationClassName?: string;
  paginationTextClassName?: string;

  // Custom components and content
  emptyStateIcon?: React.ReactNode;
  emptyStateMessage?: string;

  customSortIcon?: (sortDirection: false | "asc" | "desc") => React.ReactNode;
  skeletonClassName?: string;
  customLoader?: React.ReactNode;

  // Page size selector
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
}

export function DataTable<TData, TValue>({
  columns,
  isLoading,
  table,
  // Style customization props
  containerClassName,
  tableClassName,
  emptyPlacehoder,
  headerRowClassName = "py-3 bg-dark-blue-700 h-full hover:bg-dark-blue",
  headerCellClassName = "py-3 px-4 group text-sm font-medium text-white first:rounded-l-lg last:rounded-r-lg",
  sortIconActiveClassName = "text-fluorescent-green opacity-100",
  sortIconInactiveClassName = "text-gray-50 group-hover:text-white",
  bodyRowClassName = "border-b border-gray-100 hover:bg-lime-green/60 transition-colors cursor-pointer rounded",
  selectedRowClassName = "bg-blue-50 hover:bg-blue-50",
  bodyCellClassName = "px-4 text-sm text-gray-700 first:rounded-l-lg last:rounded-r-lg",
  noDataClassName = "h-40 text-center",
  paginationClassName = "w-full bg-white py-2 px-0 flex items-center justify-between bg-opacity-85",
  paginationTextClassName = "flex items-center gap-1 text-sm text-gray-600",

  // Custom components and content
  emptyStateIcon = <Database className="h-8 w-8 text-gray-400" />,
  emptyStateMessage = "No records found",
  customSortIcon,
  customLoader,
  skeletonClassName,

  // Page size selector
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
}: DataTableProps<TData, TValue>) {
  return (
    <div
      className={cn(
        "flex w-full flex-col justify-between rounded-lg bg-white",
        containerClassName
      )}
    >
      <div>
        <Table className={cn("border-collapse", tableClassName)}>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className={headerRowClassName}>
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  return (
                    <TableHead key={header.id} className={headerCellClassName}>
                      {header.isPlaceholder ? null : (
                        <div
                          className={cn(
                            "flex items-center space-x-2",
                            canSort && "cursor-pointer select-none"
                          )}
                          onClick={header.column.getToggleSortingHandler()}
                          data-test="sort-header"
                        >
                          <span>
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          </span>
                          {canSort && !customSortIcon && (
                            <div className="group flex flex-col items-center">
                              <ChevronUp
                                className={cn(
                                  "-mb-[6px] h-[14px] w-[14px] font-bold",
                                  header.column.getIsSorted() === "asc"
                                    ? sortIconActiveClassName
                                    : sortIconInactiveClassName
                                )}
                              />
                              <ChevronDown
                                className={cn(
                                  "h-[14px] w-[14px] font-bold",
                                  header.column.getIsSorted() === "desc"
                                    ? sortIconActiveClassName
                                    : sortIconInactiveClassName
                                )}
                              />
                            </div>
                          )}
                          {canSort &&
                            customSortIcon &&
                            customSortIcon(header.column.getIsSorted())}
                        </div>
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="m-10 h-40 animate-pulse rounded-lg bg-gray-50 text-center"
                  style={{
                    height: "450px", // Adjust height as needed`,
                  }}
                >
                  <div className="flex flex-col items-center justify-center gap-2 text-gray-500">
                    {customLoader ?? (
                      <div className="flex items-center gap-2">
                        <Loader
                          className="h-10 w-10 animate-spin text-dark-blue-600"
                          data-test="loading-spinner"
                        />
                        <p className="font-medium">Loading data...</p>
                      </div>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                const isChildRow = row.getParentRow();

                if (isChildRow) {
                  return (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className={cn(
                        row.getIsSelected() && selectedRowClassName
                      )}
                      style={{ backgroundColor: "white", cursor: "pointer" }}
                      onClick={row.getToggleSelectedHandler()}
                      data-test={`row-${row.id}`}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className={cn(bodyCellClassName)}
                        >
                          {isLoading ? (
                            <Skeleton
                              className={cn("h-8 w-full", skeletonClassName)}
                            />
                          ) : (
                            flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )
                          )}
                        </TableCell>
                      ))}
                    </TableRow>

                    // </AnimatedExpandingRow>
                  );
                }
                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={cn(
                      // Apply childRowClassName if this row has a parent
                      bodyRowClassName,
                      row.getIsSelected() && selectedRowClassName
                    )}
                    onClick={row.getToggleSelectedHandler()}
                    data-test={`row-${row.id}`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className={bodyCellClassName}>
                        {isLoading ? (
                          <Skeleton
                            className={cn("h-8 w-full", skeletonClassName)}
                          />
                        ) : (
                          flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className={noDataClassName}
                  style={{ height: "450px" }} // Adjust height as needed
                >
                  <div className="flex flex-col items-center justify-center gap-2 text-gray-500">
                    {emptyStateIcon}
                    <p className="font-medium">{emptyStateMessage}</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {(table.getRowModel().rows?.length !== 0 ||
        table.getState().pagination.pageIndex > 0 ||
        table.getPageCount() > 1 ||
        isLoading) && (
        <div className={paginationClassName}>
          {/* Page size selector */}
          {onPageSizeChange && (
            <div className="ml-4 flex items-center gap-2">
              <span className="text-sm text-gray-600">Show</span>
              <Select
                value={table.getState().pagination.pageSize.toString()}
                onValueChange={(value: any) => onPageSizeChange(Number(value))}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent side="top">
                  {pageSizeOptions.map((pageSize) => (
                    <SelectItem key={pageSize} value={pageSize.toString()}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-sm text-gray-600">per page</span>
            </div>
          )}

          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={isLoading || !table.getCanPreviousPage()}
              className="icon-button"
              data-test="previous-page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {isLoading ? (
              <div className={paginationTextClassName}>
                <span>Page</span>
                <strong className="text-gray-400">
                  <span className="inline-block w-5 text-center">&hellip;</span>{" "}
                  of{" "}
                  <span className="inline-block w-5 text-center">&hellip;</span>
                </strong>
              </div>
            ) : (
              <div
                className={cn(
                  paginationTextClassName,
                  !table.getPageCount() && "invisible"
                )}
              >
                <span>Page</span>
                <strong>
                  {table.getState().pagination.pageIndex + 1} of{" "}
                  {table.getPageCount()}
                </strong>
              </div>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={isLoading || !table.getCanNextPage()}
              className="icon-button"
              data-test="next-page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
