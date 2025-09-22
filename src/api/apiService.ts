
import Cookies from "js-cookie";
import api from "../Interceptors/Interceptor";
import type { ApiError, ApiRequestConfig, ApiResponse, HttpMethod } from "../Interface/Custom";
import { showError } from "../Custom/CustomToast";

// Function overloads for better type safety
export async function callApi<T>(
  url: string,
  method: HttpMethod,
  data?: any,
  headers?: Record<string, string>,
  responseType?: "json"
): Promise<ApiResponse<T>>;

export async function callApi<T>(
  url: string,
  method: HttpMethod,
  data: any,
  headers: Record<string, string>,
  responseType: "arraybuffer"
): Promise<ArrayBuffer>;

export async function callApi<T>(
  url: string,
  method: HttpMethod,
  data: any = null,
  headers: Record<string, string> = {},
  responseType: "json" | "arraybuffer" = "json"
): Promise<ApiResponse<T> | ArrayBuffer> {
  const token = Cookies.get("accessToken");
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config: ApiRequestConfig = {
    method,
    url,
    headers,
    responseType,
    ...(data && { data }),
  };

  try {
    const response = await api.request(config);
    if (
      responseType === "arraybuffer" &&
      response.data instanceof ArrayBuffer
    ) {
      return response.data;
    }

    if (responseType === "json" && typeof response.data === "object" || "string") {
      const responseData = response.data as ApiResponse<T> || response;

      if (method === "DELETE") {
        showError("Something went wrong");
      } else if (method !== "GET") {
        // successnotify(responseData.message || "Login Successfull");
      }

      return responseData;
    }

    throw new Error("Unexpected response type");
  } catch (error) {
    const axiosError = error as {
      response?: {
        status: number;
        data?: { message?: string; errors?: Record<string, string> };
        loading?: boolean;
      };
    };
    const apiError: ApiError = {
      status: axiosError.response?.status ?? 0,
      message: axiosError.response?.data?.message ?? "An error occurred",
      errors: axiosError.response?.data?.errors ,
      rawResponse: axiosError.response?.data,
      loading:false
    };
    throw apiError;
  }
}
