import React from 'react';

export enum SortConfigDirection {
  ascending = 'ascending',
  descending = 'descending',
}

export type SortConfig = {
  key: number | string;
  direction: SortConfigDirection;
};

export const useSortableData = (
  items: any,
  config: SortConfig | null = null
) => {
  const [sortConfig, setSortConfig] = React.useState(config);

  const sortedItems = React.useMemo(() => {
    let sortableItems = [...items];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (sortConfig.key === 'name' || sortConfig.key === 'career') {
          if (
            a.character[sortConfig.key].localeCompare(
              b.character[sortConfig.key]
            ) === -1
          ) {
            return sortConfig.direction === SortConfigDirection.ascending
              ? -1
              : 1;
          }

          if (
            a.character[sortConfig.key].localeCompare(
              b.character[sortConfig.key]
            ) === 1
          ) {
            return sortConfig.direction === SortConfigDirection.ascending
              ? 1
              : -1;
          }
          return 0;
        }

        if (sortConfig.key === 'guild') {
          if (
            (a.guild?.['name'] ?? '').localeCompare(b.guild?.['name'] ?? '') ===
            -1
          ) {
            return sortConfig.direction === SortConfigDirection.ascending
              ? -1
              : 1;
          }
        }

        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === SortConfigDirection.ascending
            ? -1
            : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === SortConfigDirection.ascending
            ? 1
            : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [items, sortConfig]);

  const requestSort = (key: string) => {
    let direction = SortConfigDirection.ascending;
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === SortConfigDirection.ascending
    ) {
      direction = SortConfigDirection.descending;
    }
    setSortConfig({ key, direction });
  };

  return { items: sortedItems, requestSort, sortConfig };
};
