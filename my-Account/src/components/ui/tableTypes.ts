import React from "react";

/**
 * Interface for customizing table styling
 */
export interface TableStyleProps {
  /** Class name for the main container div */
  containerClassName?: string;

  /** Class name for the table element */
  tableClassName?: string;

  /** Class name for the header rows */
  headerRowClassName?: string;

  /** Class name for the header cells */
  headerCellClassName?: string;

  /** Class name for active sort icons */
  sortIconActiveClassName?: string;

  /** Class name for inactive sort icons */
  sortIconInactiveClassName?: string;

  /** Class name for body rows */
  bodyRowClassName?: string;

  /** Class name for selected rows */
  selectedRowClassName?: string;

  /** Class name for body cells */
  bodyCellClassName?: string;

  /** Class name for the no data state */
  noDataClassName?: string;

  /** Class name for the pagination container */
  paginationClassName?: string;

  /** Class name for pagination text */
  paginationTextClassName?: string;

  /** Custom icon to show in empty state */
  emptyStateIcon?: React.ReactNode;

  /** Custom message to show in empty state */
  emptyStateMessage?: string;

  /** Class name for child rows */
  childRowClassName?: string;

  /** Function to render custom sort icons based on sort direction */
  customSortIcon?: (sortDirection: false | "asc" | "desc") => React.ReactNode;

  /** Class name for skeleton elements when loading */
  skeletonClassName?: string;
}
