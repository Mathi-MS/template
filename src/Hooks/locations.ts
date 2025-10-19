import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiUrls } from "../api/apiUrl";
import type { ApiResponse } from "../Interface/Custom";
import { useApi } from "../api/apiService";
import { showError, showSuccess } from "../Custom/CustomToast";

// GET LOCATIONS
export const useGetLocations = () => {
  const { callApi } = useApi();
  return useQuery({
    queryKey: ["locationList"],
    queryFn: async () => {
      const response = await callApi(`${apiUrls.location}`, "GET");
      return (response as ApiResponse).data;
    },
    refetchOnWindowFocus: true,
  });
};

// CREATE LOCATION
export const useCreateLocation = () => {
  const queryClient = useQueryClient();
  const { callApi } = useApi();

  return useMutation({
    mutationFn: async (data: any) => {
      const response = await callApi(`${apiUrls.location}`, "POST", data);
      return response as ApiResponse;
    },
    onSuccess: () => {
      showSuccess("Location Created Successfully");
      queryClient.invalidateQueries({ queryKey: ["locationList"] });
    },
    onError: (error) => {
      console.log(error);
      showError(error?.message);
    },
  });
};

// UPDATE LOCATION
export const useUpdateLocation = () => {
  const queryClient = useQueryClient();
  const { callApi } = useApi();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await callApi(`${apiUrls.location}/${id}`, "PUT", data);
      return response as ApiResponse;
    },
    onSuccess: () => {
      showSuccess("Location updated Successfully");
      queryClient.invalidateQueries({ queryKey: ["locationList"] });
    },
  });
};

// DELETE LOCATION
export const useDeleteLocation = () => {
  const queryClient = useQueryClient();
  const { callApi } = useApi();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await callApi(`${apiUrls.location}/${id}`, "DELETE");
      return response as ApiResponse;
    },
    onSuccess: () => {
      showSuccess("Location deleted Successfully");
      queryClient.invalidateQueries({ queryKey: ["locationList"] });
    },
  });
};
