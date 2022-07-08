import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BACKEND}/users`,
  }),
  endpoints: (builder) => ({
    getTopRank: builder.query({
      query: (token) => ({
        url: "/score/ranking",
        method: "GET",
        headers: {
          Authorization: token,
        },
      }),
    }),
    getRanking: builder.query({
      query: (token) => ({
        url: `/score/board`,
        method: "GET",
        headers: {
          Authorization: token,
        },
      }),
    }),
    updateProfile: builder.mutation({
      query: ({ token, data, id }) => ({
        url: `/${id}`,
        method: "PATCH",
        body: data,
        headers: {
          Authorization: token,
        },
      }),
    }),
  }),
});

export const {
  useGetRankingQuery,
  useGetTopRankQuery,
  useUpdateProfileMutation,
} = userApi;
