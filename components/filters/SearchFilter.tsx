"use client";

import { useState, useCallback } from "react";
import { debounce } from "@/lib/utils";

interface FilterOptions {
  [key: string]: { label: string; options: { label: string; value: any }[] };
}

interface SearchFilterProps {
  onSearch: (searchTerm: string) => void;
  onFilterChange?: (filters: Record<string, any>) => void;
  filters?: FilterOptions;
  placeholder?: string;
}

export default function SearchFilter({
  onSearch,
  onFilterChange,
  filters,
  placeholder = "Search...",
}: SearchFilterProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});

  const debouncedSearch = useCallback(
    debounce((term: string) => {
      onSearch(term);
    }, 300),
    [onSearch],
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const handleFilterChange = (filterKey: string, value: any) => {
    const newFilters = { ...activeFilters, [filterKey]: value };
    setActiveFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleReset = () => {
    setSearchTerm("");
    setActiveFilters({});
    onSearch("");
    onFilterChange?.({});
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex flex-col gap-4">
        <div>
          <input
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {filters && Object.entries(filters).length > 0 && (
          <div className="flex flex-wrap gap-3">
            {Object.entries(filters).map(([key, filter]) => (
              <div key={key}>
                <select
                  value={activeFilters[key] || ""}
                  onChange={(e) => handleFilterChange(key, e.target.value)}
                  className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">{filter.label}</option>
                  {filter.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        )}

        {(searchTerm || Object.keys(activeFilters).length > 0) && (
          <button
            onClick={handleReset}
            className="cursor-pointer self-start px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
          >
            Reset Filters
          </button>
        )}
      </div>
    </div>
  );
}
