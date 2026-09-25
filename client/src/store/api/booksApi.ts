import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';
import type {
  AuthorResponse,
  BookDetail,
  BookSearchParams,
  BookSummary,
  CategoryResponse,
  PagedResponse,
  PublisherResponse,
} from '@/types/api';

export const booksApi = createApi({
  reducerPath: 'booksApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Book'],
  endpoints: (builder) => ({
    searchBooks: builder.query<PagedResponse<BookSummary>, BookSearchParams>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '')
            searchParams.set(key, String(value));
        });
        return `/books?${searchParams.toString()}`;
      },
      providesTags: ['Book'],
    }),
    getBook: builder.query<BookDetail, string>({
      query: (id) => `/books/${id}`,
      providesTags: (_result, _err, id) => [{ type: 'Book', id }],
    }),
    listCategories: builder.query<CategoryResponse[], void>({
      query: () => '/categories',
    }),
    getBooksByCategory: builder.query<
      PagedResponse<BookSummary>,
      { slug: string } & BookSearchParams
    >({
      query: ({ slug, ...params }) => {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '')
            searchParams.set(key, String(value));
        });
        return `/categories/${slug}/books?${searchParams.toString()}`;
      },
    }),
    listPublishers: builder.query<PublisherResponse[], void>({
      query: () => '/publishers',
    }),
    getBooksByPublisher: builder.query<
      PagedResponse<BookSummary>,
      { id: string } & BookSearchParams
    >({
      query: ({ id, ...params }) => {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '')
            searchParams.set(key, String(value));
        });
        return `/publishers/${id}/books?${searchParams.toString()}`;
      },
    }),
    listAuthors: builder.query<AuthorResponse[], void>({
      query: () => '/authors',
    }),
    getAuthor: builder.query<AuthorResponse, string>({
      query: (id) => `/authors/${id}`,
    }),
    getAuthorBooks: builder.query<BookSummary[], string>({
      query: (id) => `/authors/${id}/books`,
    }),
  }),
});

export const {
  useSearchBooksQuery,
  useGetBookQuery,
  useListCategoriesQuery,
  useGetBooksByCategoryQuery,
  useListPublishersQuery,
  useGetBooksByPublisherQuery,
  useListAuthorsQuery,
  useGetAuthorQuery,
  useGetAuthorBooksQuery,
} = booksApi;
