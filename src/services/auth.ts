import { api } from "./api";
import { SigninRequest, SigninResponse, ApiResponse } from "../types/api";

interface LogoutResponse extends ApiResponse {}

interface RefreshResponse extends ApiResponse {
  accessToken: string;
}

export const usersApi = api.injectEndpoints({
  endpoints: (build) => ({
    signin: build.mutation<SigninResponse, SigninRequest>({
      query: (body: SigninRequest) => ({
        url: "login"+"/",
        method: "POST",
        credentials: "same-origin",
        body,
      }),
      invalidatesTags: ["login"],
    }),
    LogOut: build.mutation<LogoutResponse, void>({
      query: () => ({
        url: "auth/logout",
        method: "POST",
        credentials: "include",
      }),
      invalidatesTags: ["logout"],
    }),
    
  }),
});
// Export hooks for usage in functional components

export const { useSigninMutation, useLogOutMutation } =
  usersApi;

export const {  signin } = usersApi.endpoints;
