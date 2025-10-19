import { useQuery } from "@tanstack/react-query";
import { apiUrls } from "../api/apiUrl";
import type { ApiResponse } from "../Interface/Custom";
import { useApi } from "../api/apiService";

// Define type for filter params
export type DashboardFilterParams = {
  cityId?: string;
  locationId?: string;
  vendorId?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
};

// Hook to get both dashboard count and filters in one query
export const useGetDashboardData = (params?: DashboardFilterParams) => {
  const { callApi } = useApi();

  // Construct query string for filter parameters
  const queryString = params
    ? "?" +
      Object.entries(params)
        .filter(([_, v]) => v !== undefined && v !== "")
        .map(
          ([key, value]) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(value!)}`
        )
        .join("&")
    : "";

  return useQuery({
    queryKey: ["dashboardData", params], // includes params to refetch when changed
    queryFn: async () => {
      const response = await callApi(
        `${apiUrls.dashboard}${queryString}`,
        "GET"
      );
      return (response as ApiResponse).data;
    },
    refetchOnWindowFocus: true,
  });
};
