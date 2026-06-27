import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

export interface ApiResponse<T = unknown> {
  RES: T | null;
  MSG: { message: string; error?: string } | null;
  SUCCESS: boolean;
  TIMESTAMP: string;
  PATH: string;
  STATUS: number;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
}

export interface PaginationParams {
  page?: number;
  perPage?: number;
}

let authToken: string | null = null;

export function setAuthToken(token: string): void {
  authToken = token;
}

export function clearAuthToken(): void {
  authToken = null;
}

export function getAuthToken(): string | null {
  return authToken;
}

const isDev = import.meta.env.DEV;

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3337",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }

  if (isDev) {
    console.log(`[${config.method?.toUpperCase()}] ${config.baseURL}${config.url}`);
  }

  return config;
});

api.interceptors.response.use(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (response): any => {
    if (isDev) {
      console.log("[RESPONSE SUCCESS]", {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }

    const data: ApiResponse = response.data;
    if (!data) return null;
    if ("RES" in data) return data.RES;
    if ("data" in data && "meta" in data) return data;
    if ("data" in data) return (data as unknown as { data: unknown }).data;
    return data;
  },
  (error: AxiosError<ApiResponse>) => {
    if (isDev) {
      if (error.response) {
        console.log("[RESPONSE ERROR]", {
          status: error.response.status,
          url: error.config?.url,
          data: error.response.data,
        });
      } else if (error.request) {
        console.log("[REQUEST ERROR] No response received", {
          url: error.config?.url,
          message: error.message,
        });
      } else {
        console.log("[REQUEST SETUP ERROR]", error.message);
      }
    }

    const message =
      error.response?.data?.MSG?.message ??
      (error.response?.data as { message?: string } | undefined)?.message ??
      error.message ??
      "An unexpected error occurred";

    return Promise.reject(new Error(message));
  },
);

export default api;
