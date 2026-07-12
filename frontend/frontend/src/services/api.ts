import axios, { AxiosError } from "axios";

import type { Analysis, ApiErrorBody } from "../types/analysis";

// All API requests go through /api.
//
// Development:
// Vite proxies /api -> http://localhost:8000
//
// Production:
// Nginx proxies /api -> FastAPI
const baseURL = "/api";

export const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorBody>;
    const detail = axiosError.response?.data?.detail;

    if (typeof detail === "string") {
      return detail;
    }

    if (Array.isArray(detail) && detail.length > 0) {
      return detail.map((item) => item.msg).join(", ");
    }

    if (axiosError.message) {
      return axiosError.message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}

export async function analyzeUser(username: string): Promise<Analysis> {
  const { data } = await api.post<Analysis>("/analyze", { username });
  return data;
}

export async function getHistory(): Promise<Analysis[]> {
  const { data } = await api.get<Analysis[]>("/history");
  return data;
}
