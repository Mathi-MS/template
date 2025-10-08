import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiUrls } from "../api/apiUrl";
import type { ApiResponse } from "../Interface/Custom";
import { useApi } from "../api/apiService";
import { showSuccess } from "../Custom/CustomToast";

export const useGetLocationCosts = () => {
  const { callApi } = useApi();

  return useQuery({
    queryKey: ["locationCostList"],
    queryFn: async () => {
      const response = await callApi(`${apiUrls.locationCost}`, "GET");
      return (response as ApiResponse).data;
    },
    refetchOnWindowFocus: true,
  });
};

export const useGetLocationCostById = (id: string, enabled = true) => {
  const { callApi } = useApi();

  return useQuery({
    queryKey: ["locationCost", id],
    queryFn: async () => {
      const response = await callApi(
        `${apiUrls.locationCostbyCity}/${id}`,
        "GET"
      );
      return (response as ApiResponse).data;
    },
    enabled: !!id && enabled,
    staleTime: Infinity,
    gcTime: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
  });
};


export const useCreateLocationCost = () => {
  const queryClient = useQueryClient();
  const { callApi } = useApi();

  return useMutation({
    mutationFn: async (data: any) => {
      const response = await callApi(`${apiUrls.locationCost}`, "POST", data);
      return response as ApiResponse;
    },
    onSuccess: () => {
      showSuccess("LocationCost Created Successfully");
      queryClient.invalidateQueries({ queryKey: ["locationCostList"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useUpdateLocationCost = () => {
  const queryClient = useQueryClient();
  const { callApi } = useApi();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await callApi(
        `${apiUrls.locationCost}/${id}`,
        "PUT",
        data
      );
      return response as ApiResponse;
    },
    onSuccess: () => {
      showSuccess("LocationCost Updated Successfully");
      queryClient.invalidateQueries({ queryKey: ["locationCostList"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useDeleteLocationCost = () => {
  const queryClient = useQueryClient();
  const { callApi } = useApi();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await callApi(`${apiUrls.locationCost}/${id}`, "DELETE");
      return response as ApiResponse;
    },
    onSuccess: () => {
      showSuccess("LocationCost Deleted Successfully");
      queryClient.invalidateQueries({ queryKey: ["locationCostList"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};
