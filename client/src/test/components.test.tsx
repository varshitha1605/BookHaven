import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import OrderStatusBadge from '@/components/orders/OrderStatusBadge';
import StarRating from '@/components/common/StarRating';
import Pagination from '@/components/common/Pagination';

describe('OrderStatusBadge', () => {
  it.each([
    ['PENDING',   'Pending'],
    ['CONFIRMED', 'Confirmed'],
    ['SHIPPED',   'Shipped'],
    ['DELIVERED', 'Delivered'],
    ['CANCELLED', 'Cancelled'],
  ] as const)('renders %s correctly', (status, label) => {
    render(<OrderStatusBadge status={status} />);
    expect(screen.getByText(label)).toBeInTheDocument();
  });
});

describe('StarRating', () => {
  it('renders 5 stars', () => {
    const { container } = render(<StarRating rating={4} reviewCount={100} />);
    const svgs = container.querySelectorAll('svg');
    expect(svgs.length).toBe(5);
  });

  it('renders review count', () => {
    render(<StarRating rating={4} reviewCount={1234} />);
    expect(screen.getByText('(1,234)')).toBeInTheDocument();
  });
});

describe('Pagination', () => {
  it('renders nothing when only one page', () => {
    const { container } = render(
      <MemoryRouter><Pagination page={0} totalPages={1} onPageChange={() => {}} /></MemoryRouter>,
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders prev/next buttons for multiple pages', () => {
    render(
      <MemoryRouter><Pagination page={1} totalPages={5} onPageChange={() => {}} /></MemoryRouter>,
    );
    expect(screen.getByText('← Previous')).toBeInTheDocument();
    expect(screen.getByText('Next →')).toBeInTheDocument();
    expect(screen.getByText('Page 2 of 5')).toBeInTheDocument();
  });

  it('disables Previous on first page', () => {
    render(
      <MemoryRouter><Pagination page={0} totalPages={3} onPageChange={() => {}} /></MemoryRouter>,
    );
    expect(screen.getByText('← Previous')).toBeDisabled();
  });

  it('disables Next on last page', () => {
    render(
      <MemoryRouter><Pagination page={2} totalPages={3} onPageChange={() => {}} /></MemoryRouter>,
    );
    expect(screen.getByText('Next →')).toBeDisabled();
  });
});
