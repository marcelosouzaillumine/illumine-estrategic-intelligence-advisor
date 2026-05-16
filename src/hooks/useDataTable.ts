import { useState, useMemo, useEffect } from 'react';

export function useDataTable(data: any[], config: { 
  searchFields: string[], 
  initialSort?: { key: string, direction: 'asc' | 'desc' },
  itemsPerPage?: number;
  customFilter?: (item: any, currentFilters: Record<string, string>) => boolean;
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [sort, setSort] = useState<{ key: string; direction: 'asc' | 'desc' }>(config.initialSort || { key: '', direction: 'asc' as const });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = config.itemsPerPage || 10;

  const filteredData = useMemo(() => {
    let result = [...data];

    // Search
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(item => 
        config.searchFields.some(field => {
          const val = field.split('.').reduce((obj, key) => obj?.[key], item);
          return String(val || '').toLowerCase().includes(lowerSearch);
        })
      );
    }

    // Standard Filters
    Object.entries(filters).forEach(([field, value]) => {
      if (value && value !== 'Todos') {
        result = result.filter(item => {
          const val = field.split('.').reduce((obj, key) => obj?.[key], item);
          return String(val) === value;
        });
      }
    });

    // Custom Filter
    if (config.customFilter) {
      result = result.filter(item => config.customFilter!(item, filters));
    }

    // Sort
    if (sort.key) {
      result.sort((a, b) => {
        const valA = sort.key.split('.').reduce((obj, key) => obj?.[key], a);
        const valB = sort.key.split('.').reduce((obj, key) => obj?.[key], b);
        
        if (valA === undefined || valA === null) return 1;
        if (valB === undefined || valB === null) return -1;

        if (valA < valB) return sort.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sort.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, searchTerm, filters, sort]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleSort = (key: string) => {
    setSort(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters]);

  return {
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    sort,
    toggleSort,
    currentPage,
    setCurrentPage,
    totalPages,
    filteredData,
    paginatedData
  };
}
