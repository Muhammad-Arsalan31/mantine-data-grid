import { Stack, Title, Text } from '@mantine/core';
import { PropertyTable } from '../components/PropertyTable';
import { See } from '../components/See';

export default function Properties() {
  return (
    <Stack p="md">
      <Title order={2} style={{ display: 'flex' }}>
        {'DataGrid<'}
        <Text inherit inline color="orange" children="TData extends object = any" />
        {'> component props'}
      </Title>
      <PropertyTable
        groups={[
          {
            group: 'Common',
            children: [
              {
                name: 'columns',
                required: true,
                type: 'ColumnDef<TData, any>[]',
                description: 'Gird column definitions',
              },
              {
                name: 'data',
                required: true,
                type: 'TData[]',
                description: 'Grid data',
              },
              {
                name: 'total',
                type: 'number',
                description: (
                  <>
                    Total number of items for external data. <See ex="async" />
                  </>
                ),
              },
              {
                name: 'tableRef',
                type: 'Ref<Table<TData>>',
                description: 'Table instance ref',
              },
              {
                name: 'initialState',
                type: 'InitialTableState',
                description: (
                  <>
                    The initial table state. <See ex="initialState" />
                  </>
                ),
              },
              {
                name: 'state',
                type: 'Partial<TableState>',
                description: (
                  <>
                    The partial state of the table. <See ex="state" />
                  </>
                ),
              },
              {
                name: 'onRow',
                type: '(row: Row<TData>) => HTMLAttributes<HTMLTableRowElement>',
                description: (
                  <>
                    Callback to set props pre row. <See ex="onRowClick" />
                  </>
                ),
              },
              {
                name: 'onCell',
                type: '(cell: Cell<TData, unknown>) => HTMLAttributes<HTMLTableCellElement>',
                description: (
                  <>
                    Callback to set props pre cell. <See ex="onRowClick" />
                  </>
                ),
              },
              {
                name: 'empty',
                type: 'ReactElement',
                description: (
                  <>
                    Empty table element. <See ex="empty" />
                  </>
                ),
              },
            ],
          },
          {
            group: 'Styles',
            children: [
              { name: 'height', type: 'number', description: 'Table body height' },

              { name: 'withFixedHeader', type: 'boolean', description: 'Enable fixed header' },
              {
                name: 'noFelxLayout',
                type: 'boolean',
                description: 'Disable flex layout',
              },
              {
                name: 'noEllipsis',
                type: 'boolean',
                description: 'Disable Text overflow ellipsis',
              },
              {
                name: 'debug',
                type: 'boolean',
                description: 'If true react-table debug log is enabled',
              },
              {
                name: 'striped',
                type: 'boolean',
                description: 'If true every odd row of table will have gray background color',
              },
              {
                name: 'highlightOnHover',
                type: 'boolean',
                description: 'If true row will have hover color',
              },
              {
                name: 'horizontalSpacing',
                type: 'number | "xs" | "sm" | "md" | "lg" | "xl"',
                description: 'Horizontal cells spacing from theme.spacing or number to set value in px',
              },
              {
                name: 'verticalSpacing',
                type: 'number | "xs" | "sm" | "md" | "lg" | "xl"',
                description: 'Vertical cells spacing from theme.spacing or number to set value in px',
              },
              {
                name: 'fontSize',
                type: 'number | "xs" | "sm" | "md" | "lg" | "xl"',
                description: 'Sets font size of all text inside table',
              },
              {
                name: 'loading',
                type: 'boolean',
                description: 'Show loading overlay',
              },
            ],
          },
          {
            group: 'Resizing',
            children: [{ name: 'withColumnResizing', type: 'boolean', description: 'Enables column resizing' }],
          },
          {
            group: 'Pagination',
            children: [
              {
                name: 'withPagination',
                type: 'boolean',
                description: 'Enables pagination',
              },
              {
                name: 'pageSizes',
                type: 'string[]',
                description:
                  'Sets of string for page size (rows per page) selections.\nDefault is `["10", "25", "50", "100"]`',
              },
              {
                name: 'onPageChange',
                type: 'OnChangeCallback<DataGridPaginationState>',
                description: 'Callback when page index or page size changed',
              },
            ],
          },
          {
            group: 'Global filter',
            children: [
              {
                name: 'withGlobalFilter',
                type: 'boolean',
                description: 'Enables global search filter',
              },
              {
                name: 'onSearch',
                type: 'OnChangeCallback<string>',
                description: 'Callback when global filter changed',
              },
            ],
          },
          {
            group: 'Column filter',
            children: [
              {
                name: 'withColumnFilters',
                type: 'boolean',
                description: 'Enables column filters ',
              },
              {
                name: 'onFilter',
                type: 'OnChangeCallback<DataGridFiltersState>',
                description: 'Callback when column filter changed',
              },
            ],
          },
          {
            group: 'Sorting',
            children: [
              {
                name: 'withSorting',
                type: 'boolean',
                description: 'Enables sorting',
              },
              {
                name: 'onSort',
                type: 'OnChangeCallback<DataGridSortingState>',
                description: 'Callback when sorting changed',
              },
            ],
          },
        ]}
      />
    </Stack>
  );
}
