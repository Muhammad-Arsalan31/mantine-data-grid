import { useCallback, useEffect, useImperativeHandle, useState } from 'react';
import {
  Box,
  LoadingOverlay,
  ScrollArea,
  Stack,
  Switch,
  Table as MantineTable,
  Text,
  useMantineTheme,
  Menu,
  Button,
  Popover,
  Divider,
} from '@mantine/core';
import {
  ColumnFiltersState,
  flexRender,
  functionalUpdate,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  OnChangeFn,
  PaginationState,
  SortingState,
  useReactTable,
  RowData,
  Row,
  InitialTableState,
} from '@tanstack/react-table';
import { BoxOff } from 'tabler-icons-react';
import { useResizeObserver } from '@mantine/hooks';

import useStyles from './DataGrid.styles';

import { GlobalFilter, globalFilterFn } from './GlobalFilter';
import { ColumnSorter } from './ColumnSorter';
import { ColumnFilter } from './ColumnFilter';
import { DEFAULT_INITIAL_SIZE, Pagination } from './Pagination';
import { DataGridProps } from './types';
import ToggleColumns from './ToggleColumns';

export function DataGrid<TData extends RowData>({
  // data
  columns,
  data,
  total,
  // styles
  classNames,
  styles,
  height,
  withFixedHeader,
  noEllipsis,
  striped,
  highlightOnHover,
  horizontalSpacing,
  verticalSpacing = 'xs',
  fontSize,
  loading,
  // features
  withGlobalFilter,
  withColumnFilters,
  withColumnToggle,
  withSorting,
  withPagination,
  withColumnResizing,
  noFelxLayout,
  pageSizes,
  debug = false,
  // callbacks
  onPageChange,
  onSearch,
  onFilter,
  onSort,
  // table ref
  tableRef,
  initialState,
  state,
  onRow,
  onCell,
  iconColor,
  empty,
  // common props
  ...others
}: DataGridProps<TData>) {
  const [columnVisibility, setColumnVisibility] = useState({});

  const { classes, theme } = useStyles(
    {
      height,
      noEllipsis,
      withFixedHeader,
    },
    {
      classNames,
      styles,
      name: 'DataGrid',
    }
  );
  const [viewportRef, viewportRect] = useResizeObserver();
  const [tableWidth, setTableWidth] = useState(0);

  const color = iconColor || theme.primaryColor;

  const table = useReactTable<TData>({
    data,
    columns,
    enableGlobalFilter: !!withGlobalFilter,
    globalFilterFn,
    enableColumnFilters: !!withColumnFilters,
    enableSorting: !!withSorting,
    enableColumnResizing: !!withColumnResizing,
    columnResizeMode: 'onChange',
    manualPagination: !!total, // when external data, handle pagination manually

    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,

    debugTable: debug,
    debugHeaders: debug,
    debugColumns: debug,

    initialState,
    state,
  });
  useImperativeHandle(tableRef, () => table);

  useEffect(() => {
    if (noFelxLayout) {
      setTableWidth(table.getTotalSize());
    } else {
      const tableWidth = table.getTotalSize();
      const viewportWidth = viewportRect.width || -1;
      const nextWidth = tableWidth > viewportWidth ? tableWidth : viewportWidth;
      setTableWidth(nextWidth);
    }
  }, [viewportRect.width, noFelxLayout, table.getTotalSize()]);

  const handleGlobalFilterChange: OnChangeFn<string> = useCallback(
    (arg0) =>
      table.setState((state) => {
        const next = functionalUpdate(arg0, state.globalFilter || '');
        onSearch && onSearch(next);
        return {
          ...state,
          globalFilter: next,
        };
      }),
    [onSearch]
  );

  const handleSortingChange: OnChangeFn<SortingState> = useCallback(
    (arg0) =>
      table.setState((state) => {
        const next = functionalUpdate(arg0, state.sorting);
        onSort && onSort(next);
        return {
          ...state,
          sorting: next,
        };
      }),
    [onSort]
  );

  const handleColumnFiltersChange: OnChangeFn<ColumnFiltersState> = useCallback(
    (arg0) =>
      table.setState((state) => {
        const next = functionalUpdate(arg0, state.columnFilters);
        onFilter && onFilter(next);
        return {
          ...state,
          columnFilters: next,
        };
      }),
    [onFilter]
  );

  const handlePaginationChange: OnChangeFn<PaginationState> = useCallback(
    (arg0) => {
      const pagination = table.getState().pagination;
      const next = functionalUpdate(arg0, pagination);
      if (next.pageIndex !== pagination.pageIndex || next.pageSize !== pagination.pageSize) {
        onPageChange && onPageChange(next);
        table.setState((state) => ({
          ...state,
          pagination: next,
        }));
      }
    },
    [onPageChange]
  );

  const pageCount = withPagination && total ? Math.ceil(total / table.getState().pagination.pageSize) : undefined;

  table.setOptions((prev) => ({
    ...prev,
    pageCount,
    state: {
      ...prev.state,
      columnVisibility,
    },
    onGlobalFilterChange: handleGlobalFilterChange,
    onColumnFiltersChange: handleColumnFiltersChange,
    onSortingChange: handleSortingChange,
    onPaginationChange: handlePaginationChange,
  }));

  useEffect(() => {
    if (withPagination) {
      table.setPageSize(initialState?.pagination?.pageSize || DEFAULT_INITIAL_SIZE);
    } else {
      table.setPageSize(data.length);
    }
  }, [withPagination]);

  return (
    <Stack {...others} spacing={verticalSpacing}>
      {withColumnToggle && <ToggleColumns table={table} />}
      {withGlobalFilter && <GlobalFilter table={table} className={classes.globalFilter} />}
      <ScrollArea className={classes.scrollArea} viewportRef={viewportRef}>
        <LoadingOverlay visible={loading || false} overlayOpacity={0.8} />
        <MantineTable
          striped={striped}
          highlightOnHover={highlightOnHover}
          horizontalSpacing={horizontalSpacing}
          verticalSpacing={verticalSpacing}
          fontSize={fontSize}
          className={classes.table}
          style={{
            width: tableWidth,
          }}
        >
          <thead className={classes.thead} role="rowgroup">
            {table.getHeaderGroups().map((group) => (
              <tr key={group.id} className={classes.tr} role="row">
                {group.headers.map((header) => (
                  <th
                    key={header.id}
                    style={{
                      width: header.getSize(),
                    }}
                    className={classes.th}
                    colSpan={header.colSpan}
                    role="columnheader"
                  >
                    {!header.isPlaceholder && (
                      <div className={classes.headerCell}>
                        <div className={classes.headerCellContent}>
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </div>
                        <div className={classes.headerCellButtons}>
                          {header.column.getCanSort() && (
                            <ColumnSorter className={classes.sorter} column={header.column} color={color} />
                          )}
                          {header.column.getCanFilter() && (
                            <ColumnFilter className={classes.filter} column={header.column} color={color} />
                          )}
                        </div>
                        {header.column.getCanResize() && (
                          <div
                            className={classes.resizer}
                            onClick={(e) => e.stopPropagation()}
                            onMouseDown={header.getResizeHandler()}
                            onTouchStart={header.getResizeHandler()}
                          />
                        )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className={classes.tbody} role="rowgroup">
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr {...(onRow && onRow(row))} key={row.id} className={classes.tr} role="row">
                  {row.getVisibleCells().map((cell) => (
                    <td
                      {...(onCell && onCell(cell))}
                      key={cell.id}
                      style={{
                        width: cell.column.getSize(),
                      }}
                      className={classes.td}
                      role="cell"
                    >
                      <div className={classes.dataCell}>
                        <div className={classes.dataCellContent}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </div>
                      </div>
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr className={classes.tr} role="row">
                <td colSpan={table.getVisibleLeafColumns().length}>
                  <Stack align="center" spacing="xs">
                    {empty || (
                      <>
                        <BoxOff size={64} />
                        <Text weight="bold">No Data</Text>
                      </>
                    )}
                  </Stack>
                </td>
              </tr>
            )}
          </tbody>
        </MantineTable>
      </ScrollArea>

      {withPagination && (
        <Pagination
          totalRows={data.length}
          table={table}
          pageSizes={pageSizes}
          fontSize={fontSize}
          color={color}
          classes={[classes.pagination, classes.pagination_info, classes.pagination_size, classes.pagination_page]}
        />
      )}
    </Stack>
  );
}
