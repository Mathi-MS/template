import { useUser } from "../Config/userContext";
import api from "../Interceptors/Interceptor";
import type { ApiError, ApiRequestConfig, ApiResponse, HttpMethod } from "../Interface/Custom";
import { apiUrls } from "./apiUrl";
// import { apiUrls } from "./apiUrl";

export const useApi = () => {
  const { user } = useUser();
  const token = user?.token;

  const callApi = async <T>(
    url: string,
    method: HttpMethod,
    data: any = null,
    headers: Record<string, string> = {},
    responseType: "json" | "arraybuffer" = "json"
  ): Promise<ApiResponse<T> | ArrayBuffer> => {
    if (token && url !== apiUrls.login) {
      headers.Authorization = `Bearer ${token}`;
    }

    const config: ApiRequestConfig = {
      method,
      url,
      headers,
      responseType,
      withCredentials: true,
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

      if (responseType === "json" && typeof response.data === "object") {
        const responseData = response.data as ApiResponse<T>;
        return responseData;
      }

      throw new Error("Unexpected response type");
    } catch (error) {
      const axiosError = error as {
        response?: {
          status: number;
          data?: { message?: string; errors?: Record<string, string> };
        };
      };
      const apiError: ApiError = {
        status: axiosError.response?.status ?? 0,
        message: axiosError.response?.data?.message ?? "An error occurred",
        errors: axiosError.response?.data?.errors,
      };
      throw apiError;
    }
  };

  return { callApi };
};
