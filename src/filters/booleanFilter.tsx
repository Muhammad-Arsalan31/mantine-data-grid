import { Button, Group, Radio } from '@mantine/core';
import { DataGridFilterFn, DataGridFilterProps } from '../types';

export enum BooleanFilter {
    Equals = 'eq',
}

export const booleanFilterFn: DataGridFilterFn<any> = (
    row,
    columnId,
    filter
) => {
    const rowValue = Boolean(row.getValue(columnId));
    const op = filter.op || BooleanFilter.Equals;
    const filterValue = Boolean(filter.value);
    switch (op) {
        case BooleanFilter.Equals:
            return rowValue === filterValue;
        default:
            return true;
    }
};
booleanFilterFn.autoRemove = (val) => !val;

booleanFilterFn.init = () => ({
    op: BooleanFilter.Equals,
    value: true,
});

booleanFilterFn.element = function ({
    filter,
    onFilterChange,
}: DataGridFilterProps) {
    const handleValueChange = (value: boolean) => () =>
        onFilterChange({ ...filter, value });

    return (
        <Button.Group>
            {[true, false].map((value) => (
                <Button
                    key={String(value)}
                    color={filter.value === value ? 'blue' : 'gray'}
                    style={{ flexGrow: 1 }}
                    children={String(value)}
                    onClick={handleValueChange(value)}
                />
            ))}
        </Button.Group>
    );
};
