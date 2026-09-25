import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSearchBooksQuery, useListCategoriesQuery, useListPublishersQuery } from '@/store/api/booksApi';
import BookCard from '@/components/books/BookCard';
import BookFilters from '@/components/books/BookFilters';
import Pagination from '@/components/common/Pagination';
import Spinner from '@/components/common/Spinner';
import type { BookSearchParams } from '@/types/api';

const SORT_OPTIONS = [
  { value: 'title,asc',           label: 'Title A–Z' },
  { value: 'title,desc',          label: 'Title Z–A' },
  { value: 'price,asc',           label: 'Price: Low to High' },
  { value: 'price,desc',          label: 'Price: High to Low' },
  { value: 'averageRating,desc',  label: 'Highest Rated' },
  { value: 'publishedDate,desc',  label: 'Newest' },
];

export default function BrowsePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(0);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filters: BookSearchParams = {
    query:       searchParams.get('query')      ?? undefined,
    categoryId:  searchParams.get('categoryId') ?? undefined,
    publisherId: searchParams.get('publisherId') ?? undefined,
    minPrice:    searchParams.get('minPrice')   ? Number(searchParams.get('minPrice'))  : undefined,
    maxPrice:    searchParams.get('maxPrice')   ? Number(searchParams.get('maxPrice'))  : undefined,
    minRating:   searchParams.get('minRating')  ? Number(searchParams.get('minRating')) : undefined,
    inStockOnly: searchParams.get('inStockOnly') === 'true',
    sort:        searchParams.get('sort') ?? 'title,asc',
    page,
    size: 20,
  };

  const { data, isLoading, isFetching } = useSearchBooksQuery(filters);
  const { data: categories } = useListCategoriesQuery();
  const { data: publishers }  = useListPublishersQuery();

  function applyFilter(key: string, value: string | undefined) {
    setPage(0);
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  }

  const totalBooks = data?.pagination.totalElements ?? 0;

  return (
    <div className="flex gap-8">

      {/* ── Desktop sidebar ─────────────────────────── */}
      <aside className="hidden md:block w-60 shrink-0">
        <div className="bg-white rounded-2xl border shadow-card p-4 sticky top-20" style={{ borderColor: '#E5E7EB' }}>
          <BookFilters
            filters={filters}
            categories={categories ?? []}
            publishers={publishers ?? []}
            onFilter={applyFilter}
          />
        </div>
      </aside>

      {/* ── Main content ─────────────────────────────── */}
      <div className="flex-1 min-w-0">

        {/* Toolbar */}
        <div className="flex items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            {/* Mobile filter toggle */}
            <button
              className="md:hidden flex items-center gap-1.5 px-3 py-2 text-sm font-medium border rounded-lg hover:bg-gray-50 transition-colors"
              style={{ borderColor: '#E5E7EB', color: '#1F2937' }}
              onClick={() => setMobileFiltersOpen(true)}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
              </svg>
              Filters
            </button>
            <p className="text-sm" style={{ color: '#6B7280' }}>
              {isLoading ? '' : `${totalBooks.toLocaleString()} book${totalBooks !== 1 ? 's' : ''}`}
            </p>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-500 hidden sm:block shrink-0">Sort by</label>
            <select
              className="select-base w-auto text-sm pr-8"
              value={filters.sort}
              onChange={(e) => applyFilter('sort', e.target.value)}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Active filter chips */}
        {filters.query && (
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="badge gap-1" style={{ backgroundColor: '#D6EDE3', color: '#0F5132' }}>
              "{filters.query}"
              <button onClick={() => applyFilter('query', undefined)} className="ml-1 font-bold">×</button>
            </span>
          </div>
        )}

        {/* Grid */}
        {isLoading || isFetching ? (
          <div className="flex items-center justify-center py-24">
            <Spinner />
          </div>
        ) : data?.content.length === 0 ? (
          <div className="text-center py-24 space-y-3">
            <svg className="w-12 h-12 text-gray-300 mx-auto" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <p className="text-gray-500 font-medium">No books found</p>
            <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {data?.content.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}

        <Pagination
          page={page}
          totalPages={data?.pagination.totalPages ?? 0}
          onPageChange={setPage}
        />
      </div>

      {/* ── Mobile filter drawer ─────────────────────── */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-gray-900/50"
            onClick={() => setMobileFiltersOpen(false)}
          />
          {/* Panel */}
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-white overflow-y-auto p-4 shadow-xl" style={{ borderRight: '1px solid #E5E7EB' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold" style={{ color: '#1F2937' }}>Filters</h2>
              <button
                className="p-1.5 rounded-lg hover:bg-gray-100"
                style={{ color: '#6B7280' }}
                onClick={() => setMobileFiltersOpen(false)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <BookFilters
              filters={filters}
              categories={categories ?? []}
              publishers={publishers ?? []}
              onFilter={(key, value) => {
                applyFilter(key, value);
              }}
            />
            <button
              className="mt-6 w-full py-2.5 text-white rounded-lg font-semibold transition-colors"
              style={{ backgroundColor: '#0F5132' }}
              onClick={() => setMobileFiltersOpen(false)}
            >
              Show {totalBooks.toLocaleString()} results
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
