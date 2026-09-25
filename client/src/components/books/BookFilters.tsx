import { useRef } from 'react';
import type { BookSearchParams, CategoryResponse, PublisherResponse } from '@/types/api';

interface BookFiltersProps {
  filters: BookSearchParams;
  categories: CategoryResponse[];
  publishers: PublisherResponse[];
  onFilter: (key: string, value: string | undefined) => void;
}

const ACTIVE_FILTER_KEYS = ['query', 'categoryId', 'publisherId', 'minPrice', 'maxPrice', 'minRating', 'inStockOnly'] as const;

export default function BookFilters({ filters, categories, publishers, onFilter }: BookFiltersProps) {
  const searchRef = useRef<HTMLInputElement>(null);

  const hasActiveFilters = ACTIVE_FILTER_KEYS.some((k) => {
    const v = filters[k as keyof BookSearchParams];
    return v !== undefined && v !== '' && v !== false;
  });

  function clearAll() {
    ACTIVE_FILTER_KEYS.forEach((k) => onFilter(k, undefined));
    if (searchRef.current) searchRef.current.value = '';
  }

  return (
    <div className="flex flex-col gap-5">

      {/* Header row */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="text-xs font-medium hover:underline transition-colors"
            style={{ color: '#0F5132' }}
          >
            Clear all
          </button>
        )}
      </div>

      {/* ── Search ──────────────────────────────────── */}
      <FilterSection label="Search">
        <div className="relative">
          <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
            fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            ref={searchRef}
            type="text"
            placeholder="Title, author, ISBN…"
            className="input-base pl-8 pr-8"
            defaultValue={filters.query ?? ''}
            onKeyDown={(e) => {
              if (e.key === 'Enter')
                onFilter('query', (e.target as HTMLInputElement).value.trim() || undefined);
            }}
          />
          {filters.query && (
            <button
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => {
                onFilter('query', undefined);
                if (searchRef.current) searchRef.current.value = '';
              }}
              aria-label="Clear search"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <p className="text-xs text-gray-400 mt-1">Press Enter to search</p>
      </FilterSection>

      {/* ── Category ────────────────────────────────── */}
      <FilterSection label="Category">
        <div className="space-y-1">
          <RadioOption
            checked={!filters.categoryId}
            onClick={() => onFilter('categoryId', undefined)}
            label="All categories"
          />
          {categories.filter((c) => !c.parentId).map((c) => (
            <RadioOption
              key={c.id}
              checked={filters.categoryId === c.id}
              onClick={() => onFilter('categoryId', c.id)}
              label={c.name}
            />
          ))}
        </div>
      </FilterSection>

      {/* ── Publisher ───────────────────────────────── */}
      <FilterSection label="Publisher">
        <select
          className="select-base"
          value={filters.publisherId ?? ''}
          onChange={(e) => onFilter('publisherId', e.target.value || undefined)}
        >
          <option value="">All publishers</option>
          {publishers.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </FilterSection>

      {/* ── Price range ─────────────────────────────── */}
      <FilterSection label="Price range">
        <div className="flex items-center gap-2">
          <input
            type="number" min="0" placeholder="₹Min"
            className="input-base"
            defaultValue={filters.minPrice ?? ''}
            onBlur={(e) => onFilter('minPrice', e.target.value || undefined)}
          />
          <span className="text-gray-400 shrink-0">–</span>
          <input
            type="number" min="0" placeholder="₹Max"
            className="input-base"
            defaultValue={filters.maxPrice ?? ''}
            onBlur={(e) => onFilter('maxPrice', e.target.value || undefined)}
          />
        </div>
      </FilterSection>

      {/* ── Min rating ──────────────────────────────── */}
      <FilterSection label="Minimum rating">
        <div className="space-y-1">
          <RadioOption
            checked={!filters.minRating}
            onClick={() => onFilter('minRating', undefined)}
            label="Any rating"
          />
          {[4.5, 4, 3.5, 3].map((r) => (
            <RadioOption
              key={r}
              checked={Number(filters.minRating) === r}
              onClick={() => onFilter('minRating', String(r))}
              label={
                <span className="flex items-center gap-1">
                  {r}+
                  <span className="text-yellow-400">★</span>
                </span>
              }
            />
          ))}
        </div>
      </FilterSection>

      {/* ── In stock ────────────────────────────────── */}
      <label className="flex items-center gap-2.5 cursor-pointer group">
        <div className="relative">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={!!filters.inStockOnly}
            onChange={(e) => onFilter('inStockOnly', e.target.checked ? 'true' : undefined)}
          />
          <div
            className="w-9 h-5 rounded-full transition-colors"
            style={{ backgroundColor: filters.inStockOnly ? '#0F5132' : '#D1D5DB' }}
          />
          <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
        </div>
        <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">In stock only</span>
      </label>
    </div>
  );
}

function FilterSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-gray-100 pt-4">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2.5">{label}</p>
      {children}
    </div>
  );
}

function RadioOption({
  checked,
  onClick,
  label,
}: {
  checked: boolean;
  onClick: () => void;
  label: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-sm text-left transition-colors ${
        checked
          ? 'font-medium'
          : 'text-gray-700 hover:bg-gray-50'
      }`}
      style={checked ? { backgroundColor: '#F0F7F4', color: '#0F5132' } : {}}
    >
      <span className="w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors"
        style={checked ? { borderColor: '#0F5132', backgroundColor: '#0F5132' } : { borderColor: '#D1D5DB' }}
      >
        {checked && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
      </span>
      {label}
    </button>
  );
}
