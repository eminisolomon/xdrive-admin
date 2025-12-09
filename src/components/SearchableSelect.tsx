import { useState, useEffect } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { CheckIcon } from '@heroicons/react/24/solid';

interface Option {
  id: string | number;
  name: string;
}

interface SearchableSelectProps {
  options: Option[];
  value?: string | number;
  onChange: (value: string | number) => void;
  onSearch: (query: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  isLoading?: boolean;
  disabled?: boolean;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  value,
  onChange,
  onSearch,
  placeholder = 'Select option',
  label,
  error,
  isLoading,
  disabled,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Find selected option object
  const selectedOption = options.find((opt) => opt.id === value);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, onSearch]);

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="block text-sm font-medium text-(--color-text)">
          {label}
        </label>
      )}

      <DropdownMenu.Root open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenu.Trigger asChild disabled={disabled}>
          <button
            type="button"
            className={`
              w-full flex items-center justify-between
              rounded-xl border bg-(--color-surface)
              px-4 py-3.5 text-left text-sm transition-all duration-200
              focus:outline-none focus:ring-4 focus:ring-(--color-primary)/20
              disabled:opacity-50 disabled:cursor-not-allowed
              ${
                error
                  ? 'border-(--color-error)'
                  : 'border-(--color-border) hover:border-(--color-primary)'
              }
              ${!value ? 'text-(--color-inactive)' : 'text-(--color-text)'}
            `}
          >
            <span className="truncate">
              {selectedOption ? selectedOption.name : placeholder}
            </span>
            <ChevronDownIcon className="h-5 w-5 text-(--color-body)" />
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className="z-50 min-w-(--radix-dropdown-menu-trigger-width) overflow-hidden rounded-xl border border-(--color-border) bg-(--color-surface) shadow-lg animate-in fade-in-80 zoom-in-95"
            sideOffset={5}
            align="start"
          >
            <div className="p-2 border-b border-(--color-border)">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-(--color-body)" />
                <input
                  className="w-full rounded-lg bg-(--color-background) py-2 pl-9 pr-3 text-sm text-(--color-text) placeholder:text-(--color-inactive) focus:outline-none focus:ring-1 focus:ring-(--color-primary)"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.stopPropagation()}
                />
              </div>
            </div>

            <div className="max-h-[200px] overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-gray-200">
              {isLoading ? (
                <div className="py-6 text-center text-xs text-(--color-body)">
                  Loading...
                </div>
              ) : options.length === 0 ? (
                <div className="py-6 text-center text-xs text-(--color-body)">
                  No results found
                </div>
              ) : (
                options.map((option) => (
                  <DropdownMenu.Item
                    key={option.id}
                    className="
                      relative flex cursor-pointer select-none items-center
                      rounded-lg py-2.5 pl-3 pr-9 text-sm text-(--color-text)
                      outline-none data-highlighted:bg-(--color-hover)
                      data-highlighted:text-(--color-primary)
                    "
                    onSelect={() => {
                      onChange(option.id);
                      setIsOpen(false);
                      setSearchTerm('');
                    }}
                  >
                    <span className="truncate">{option.name}</span>
                    {option.id === value && (
                      <span className="absolute right-3 flex h-3.5 w-3.5 items-center justify-center">
                        <CheckIcon className="h-4 w-4 text-(--color-primary)" />
                      </span>
                    )}
                  </DropdownMenu.Item>
                ))
              )}
            </div>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      {error && <p className="text-sm text-(--color-error)">{error}</p>}
    </div>
  );
};

export default SearchableSelect;
