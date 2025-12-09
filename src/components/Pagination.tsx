import type React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import type { Pagination as PaginationData } from '@/interfaces';

interface PaginationProps {
  pagination: PaginationData;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  pagination,
  onPageChange,
}) => {
  const { current_page, last_page, total, from, to } = pagination;

  if (last_page <= 1) return null;

  const getPageNumbers = () => {
    const maxPagesToShow = 5;
    const pages: (number | string)[] = [];

    if (last_page <= maxPagesToShow) {
      for (let i = 1; i <= last_page; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(2, current_page - 1);
      const endPage = Math.min(last_page - 1, current_page + 1);

      pages.push(1);

      if (startPage > 2) {
        pages.push('...');
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < last_page - 1) {
        pages.push('...');
      }

      if (last_page > 1) {
        pages.push(last_page);
      }
    }

    return pages;
  };

  return (
    <div className="flex flex-col items-center gap-6 mt-8">
      {from && to && (
        <div className="text-sm text-gray-500 font-medium tracking-wide">
          Showing <span className="text-gray-900 font-semibold">{from}</span> to{' '}
          <span className="text-gray-900 font-semibold">{to}</span> of{' '}
          <span className="text-gray-900 font-semibold">
            {total.toLocaleString()}
          </span>{' '}
          results
        </div>
      )}

      <div className="flex items-center gap-1 p-2 bg-white rounded-xl shadow-sm border border-gray-100">
        <button
          onClick={() => onPageChange(current_page - 1)}
          disabled={current_page === 1}
          className="flex items-center justify-center w-10 h-10 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
          aria-label="Previous page"
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1 mx-2">
          {getPageNumbers().map((page, index) => (
            <div key={index}>
              {page === '...' ? (
                <span className="flex items-center justify-center w-10 h-10 text-gray-400 text-sm">
                  ⋯
                </span>
              ) : (
                <button
                  onClick={() => onPageChange(page as number)}
                  className={`flex items-center justify-center w-10 h-10 text-sm font-medium rounded-lg transition-all duration-200 ${
                    page === current_page
                      ? 'bg-linear-to-r from-blue-500 to-blue-600 text-white shadow-md shadow-blue-500/25 scale-105'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  aria-label={`Page ${page}`}
                >
                  {page}
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={() => onPageChange(current_page + 1)}
          disabled={current_page === last_page}
          className="flex items-center justify-center w-10 h-10 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
          aria-label="Next page"
        >
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
