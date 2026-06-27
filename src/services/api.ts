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

/**
 * Friendly, user-facing replacements for technical/internal error strings.
 *
 * The back-end already returns friendly Portuguese messages for domain errors
 * in `MSG.error` (e.g. "E-mail ou senha incorretos."), so those pass through
 * untouched. Only the generic/internal strings below are translated.
 */
const FRIENDLY_ERROR_MESSAGES: Record<string, string> = {
  "Validation error": "Verifique os dados informados e tente novamente.",
  "Log not found": "Registro não encontrado.",
  "An error occurred.": "Não foi possível concluir a operação. Tente novamente.",
  "Internal server error.":
    "Ocorreu um erro inesperado. Tente novamente em instantes.",
};

const NETWORK_ERROR_MESSAGE =
  "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.";

const GENERIC_ERROR_MESSAGE =
  "Não foi possível concluir a operação. Tente novamente.";

/**
 * Resolves a friendly, user-facing message from a failed request.
 *
 * Priority: the back-end's `MSG.error` (the real, friendly message) → `MSG.message`
 * → axios message. Known technical strings are mapped to friendlier copy, and
 * requests that never reached the server surface a connectivity message.
 */
function resolveFriendlyErrorMessage(error: AxiosError<ApiResponse>): string {
  // Request was sent but no response came back (server down, offline, CORS).
  if (error.request && !error.response) {
    return NETWORK_ERROR_MESSAGE;
  }

  const data = error.response?.data;
  const raw =
    data?.MSG?.error?.trim() ||
    data?.MSG?.message?.trim() ||
    (data as { message?: string } | undefined)?.message?.trim() ||
    error.message?.trim() ||
    "";

  if (!raw) return GENERIC_ERROR_MESSAGE;

  return FRIENDLY_ERROR_MESSAGES[raw] ?? raw;
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

    return Promise.reject(new Error(resolveFriendlyErrorMessage(error)));
  },
);

export default api;
