import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';
import type {
  BuyAgainResponse,
  CheckoutRequest,
  OrderDetail,
  OrderSummary,
  PagedResponse,
} from '@/types/api';

export const ordersApi = createApi({
  reducerPath: 'ordersApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Order'],
  endpoints: (builder) => ({
    listOrders: builder.query<PagedResponse<OrderSummary>, { page?: number; size?: number }>({
      query: ({ page = 0, size = 20 } = {}) => `/orders?page=${page}&size=${size}`,
      providesTags: ['Order'],
    }),
    getOrder: builder.query<OrderDetail, string>({
      query: (id) => `/orders/${id}`,
      providesTags: (_result, _err, id) => [{ type: 'Order', id }],
    }),
    placeOrder: builder.mutation<OrderDetail, CheckoutRequest>({
      query: (body) => ({ url: '/orders', method: 'POST', body }),
      invalidatesTags: ['Order'],
    }),
    cancelOrder: builder.mutation<OrderDetail, { id: string; reason: string }>({
      query: ({ id, reason }) => ({
        url: `/orders/${id}/cancel`,
        method: 'POST',
        body: { reason },
      }),
      invalidatesTags: ['Order'],
    }),
    buyAgain: builder.mutation<BuyAgainResponse, string>({
      query: (id) => ({ url: `/orders/${id}/buy-again`, method: 'POST' }),
    }),
  }),
});

export const {
  useListOrdersQuery,
  useGetOrderQuery,
  usePlaceOrderMutation,
  useCancelOrderMutation,
  useBuyAgainMutation,
} = ordersApi;
