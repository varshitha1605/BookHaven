import Button from './Button';

interface PaginationProps {
  page: number;        // zero-based
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 0}
      >
        ← Previous
      </Button>

      <span className="text-sm text-gray-600 px-2">
        Page {page + 1} of {totalPages}
      </span>

      <Button
        variant="secondary"
        size="sm"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages - 1}
      >
        Next →
      </Button>
    </div>
  );
}
