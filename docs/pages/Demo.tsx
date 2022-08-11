import {
  Badge,
  CheckIcon,
  ColorSwatch,
  createStyles,
  Grid,
  Group,
  MantineSize,
  MultiSelect,
  NumberInput,
  Slider,
  Space,
  Stack,
  Switch,
  Text,
  Title,
} from '@mantine/core';
import { useState } from 'react';

import {
  createDateFilter,
  DataGrid,
  DataGridFilterFn,
  DataGridFiltersState,
  DataGridPaginationState,
  DataGridSortingState,
  createBooleanFilter,
  highlightFilterValue,
  createNumberFilter,
  createStringFilter,
  StringFilterOperator,
} from '../../src';
import { Data, demoData } from '../demoData';

const sizeMap = new Map<string | number, string | number>([
  ['xs', 0],
  ['sm', 25],
  ['md', 50],
  ['lg', 75],
  ['xl', 100],
  [0, 'xs'],
  [25, 'sm'],
  [50, 'md'],
  [75, 'lg'],
  [100, 'xl'],
]);

const catFilter: DataGridFilterFn<Data, string[]> = (row, columnId, filter) => {
  const rowValue = String(row.getValue(columnId));
  return Array.isArray(filter) ? filter.includes(rowValue) : false;
};
catFilter.autoRemove = (val) => !val;
catFilter.init = () => [];
catFilter.element = function ({ filter, onFilterChange }) {
  return (
    <MultiSelect
      data={[
        { value: 'Peterbald', label: 'Peterbald' },
        { value: 'Chartreux', label: 'Chartreux' },
        { value: 'Highlander', label: 'Highlander' },
        { value: 'Savannah', label: 'Savannah' },
        { value: 'Birman', label: 'Birman' },
        { value: 'Burmese', label: 'Burmese' },
        { value: 'Siberian', label: 'Siberian' },
      ]}
      value={filter || []}
      onChange={onFilterChange}
      placeholder="Filter value"
    />
  );
};

const useStyles = createStyles((theme) => ({
  gridWrapper: {
    display: 'flex',
    alignItems: 'stretch',
    width: '100%',
    marginTop: theme.spacing.lg,
  },
  gridProps: {
    borderLeftWidth: 1,
    borderLeftStyle: 'solid',
    borderLeftColor: theme.colors.gray[6],
  },
}));

export default function Demo() {
  const { classes, theme } = useStyles();

  const initialPageIndex = 0;
  const initialPageSize = 10;
  const [columnVisibility, setColumnVisibility] = useState({});

  const [state, setState] = useState({
    horizontalSpacing: 'xs' as MantineSize,
    verticalSpacing: 'xs' as MantineSize,
    fontSize: 'md' as MantineSize,
    height: 0,
    withFixedHeader: false,
    noEllipsis: false,
    withGlobalFilter: true,
    withPagination: true,
    withColumnFilters: true,
    withSorting: true,
    noFelxLayout: false,
    withColumnResizing: true,
    striped: true,
    highlightOnHover: true,
    loading: false,
    showEmpty: false,
    iconColor: theme.primaryColor,
  });

  const onPageChange = (e: DataGridPaginationState) => {
    console.log(`pageIndex: ${e.pageIndex}, pageSize: ${e.pageSize}`);
  };

  const onFilter = (e: DataGridFiltersState) => {
    console.group('filter');
    console.log(e);
    console.groupEnd();
  };
  const onSearch = (e: string) => {
    console.log(`search: ${e}`);
  };
  const onSort = (e: DataGridSortingState) => {
    console.log(e.length ? `sorting: ${e[0].id} ${e[0].desc}` : 'no sorting');
  };

  const update = (next: Partial<typeof state>) => {
    setState((last) => ({ ...last, ...next }));
  };

  return (
    <Grid className={classes.gridWrapper}>
      <Grid.Col span={10} p="md">
        <DataGrid<Data>
          debug
          data={state.showEmpty ? [] : state.withPagination ? demoData : demoData.slice(0, 25)}
          horizontalSpacing={state.horizontalSpacing}
          verticalSpacing={state.verticalSpacing}
          fontSize={state.fontSize}
          height={state.height}
          withFixedHeader={state.withFixedHeader}
          noEllipsis={state.noEllipsis}
          withGlobalFilter={state.withGlobalFilter}
          withPagination={state.withPagination}
          withColumnFilters={state.withColumnFilters}
          withSorting={state.withSorting}
          withColumnResizing={state.withColumnResizing}
          noFelxLayout={state.noFelxLayout}
          striped={state.striped}
          highlightOnHover={state.highlightOnHover}
          loading={state.loading}
          iconColor={state.iconColor}
          onPageChange={onPageChange}
          onSort={onSort}
          onFilter={onFilter}
          onSearch={onSearch}
          withColumnToggle
          columns={[
            {
              accessorKey: 'id',
              header: 'No',
              size: 60,
            },
            {
              accessorKey: 'text',
              header: 'Text that is too long for a Header',
              filterFn: createStringFilter({
                title: 'Filter with Title',
              }),
              size: 200,
              cell: highlightFilterValue,
            },
            {
              header: 'Animal',
              columns: [
                { accessorKey: 'cat', filterFn: catFilter },
                {
                  accessorKey: 'fish',
                  filterFn: createStringFilter({
                    title: 'Filter with only includes operator',
                    fixedOperator: StringFilterOperator.Includes,
                  }),
                },
              ],
            },
            {
              accessorKey: 'city',
              filterFn: createStringFilter({}),
            },
            {
              accessorKey: 'value',
              filterFn: createNumberFilter({}),
            },
            {
              accessorKey: 'date',
              cell: (cell) => cell.getValue<Date>()?.toLocaleDateString(),
              filterFn: createDateFilter({
                title: 'Date Filter',
              }),
            },
            {
              accessorKey: 'bool',
              cell: (cell) => {
                if (cell.getValue()) {
                  return <Badge color="teal">true</Badge>;
                }
                return <Badge color="red">false</Badge>;
              },
              filterFn: createBooleanFilter({
                title: 'Boolean filter',
                trueLabel: 'Ja',
                falseLabel: 'Nein',
              }),
            },
          ]}
        />
      </Grid.Col>
      <Grid.Col span={2} p="md" className={classes.gridProps}>
        <Stack>
          <Title order={2}>Properties</Title>
          <Text color="dimmed">Features</Text>
          <Switch
            label="With global filter"
            checked={state.withGlobalFilter}
            onChange={(e) =>
              update({
                withGlobalFilter: e.target.checked,
              })
            }
          />
          <Switch
            label="With column filters"
            checked={state.withColumnFilters}
            onChange={(e) =>
              update({
                withColumnFilters: e.target.checked,
              })
            }
          />
          <Switch
            label="With sorting"
            checked={state.withSorting}
            onChange={(e) =>
              update({
                withSorting: e.target.checked,
              })
            }
          />
          <Switch
            label="With pagination"
            checked={state.withPagination}
            onChange={(e) =>
              update({
                withPagination: e.target.checked,
              })
            }
          />
          <Switch
            label="With column resizing"
            checked={state.withColumnResizing}
            onChange={(e) =>
              update({
                withColumnResizing: e.target.checked,
              })
            }
          />
          <Text color="dimmed">Styles</Text>
          <Switch
            label="No flex layout"
            checked={state.noFelxLayout}
            onChange={(e) =>
              update({
                noFelxLayout: e.target.checked,
              })
            }
          />
          <NumberInput
            label="Table body height"
            value={state.height}
            onChange={(val) =>
              update({
                height: val,
              })
            }
          />
          <Switch
            label="With fixed Header"
            checked={state.withFixedHeader}
            onChange={(e) =>
              update({
                withFixedHeader: e.target.checked,
              })
            }
          />
          <Switch
            label="No Text ellipsis"
            checked={state.noEllipsis}
            onChange={(e) =>
              update({
                noEllipsis: e.target.checked,
              })
            }
          />
          <Switch
            label="Striped"
            checked={state.striped}
            onChange={(e) =>
              update({
                striped: e.target.checked,
              })
            }
          />
          <Switch
            label="Highlight on hover"
            checked={state.highlightOnHover}
            onChange={(e) =>
              update({
                highlightOnHover: e.target.checked,
              })
            }
          />
          <Switch
            label="Loading"
            checked={state.loading}
            onChange={(e) =>
              update({
                loading: e.target.checked,
              })
            }
          />
          <Switch
            label="Empty State"
            checked={state.showEmpty}
            onChange={(e) =>
              update({
                showEmpty: e.target.checked,
              })
            }
          />
          <div>
            <Text weight="bold">Font Size</Text>
            <Slider
              step={25}
              label={(value) => sizeMap.get(value)}
              marks={[...sizeMap.entries()]
                .filter((x) => typeof x[0] === 'number')
                .map(([value, label]) => ({
                  value: +value,
                  label,
                }))}
              value={+(sizeMap.get(state.fontSize) || 0)}
              onChange={(e) =>
                update({
                  fontSize: sizeMap.get(e)?.toString() as MantineSize,
                })
              }
            />
          </div>
          <Space />
          <div>
            <Text weight="bold">Vertical Spacing</Text>
            <Slider
              step={25}
              label={(value) => sizeMap.get(value)}
              marks={[...sizeMap.entries()]
                .filter((x) => typeof x[0] === 'number')
                .map(([value, label]) => ({
                  value: +value,
                  label,
                }))}
              value={+(sizeMap.get(state.verticalSpacing) || 0)}
              onChange={(e) =>
                update({
                  verticalSpacing: sizeMap.get(e)?.toString() as MantineSize,
                })
              }
            />
          </div>
          <Space />
          <div>
            <Text weight="bold">Horizontal Spacing</Text>
            <Slider
              step={25}
              label={(value) => sizeMap.get(value)}
              marks={[...sizeMap.entries()]
                .filter((x) => typeof x[0] === 'number')
                .map(([value, label]) => ({
                  value: +value,
                  label,
                }))}
              value={+(sizeMap.get(state.horizontalSpacing) || 0)}
              onChange={(e) =>
                update({
                  horizontalSpacing: sizeMap.get(e)?.toString() as MantineSize,
                })
              }
            />
          </div>
          <Space />
          <div>
            <Text weight="bold">Icon Color</Text>
            <Group spacing="xs">
              {Object.keys(theme.colors).map((color) => (
                <ColorSwatch
                  component="button"
                  key={color}
                  color={theme.colors[color][6]}
                  onClick={() =>
                    update({
                      iconColor: color,
                    })
                  }
                  sx={{ color: '#fff', cursor: 'pointer' }}
                >
                  {state.iconColor === color && <CheckIcon width={10} />}
                </ColorSwatch>
              ))}
            </Group>
          </div>
        </Stack>
      </Grid.Col>
    </Grid>
  );
}
