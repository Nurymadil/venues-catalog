'use client';

import { SortOption } from '../types';

interface SortButtonsProps {
  currentSort: SortOption;
  onSortChange: (option: SortOption) => void;
}

export default function SortButtons({ currentSort, onSortChange }: SortButtonsProps) {
  const sortOptions = [
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {sortOptions.map((option) => (
        <button
          key={option.value}
          type="button"
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
            currentSort === option.value
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-blue-300'
          }`}
          onClick={() => onSortChange(option.value as SortOption)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}