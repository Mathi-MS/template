import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiUrls } from "../api/apiUrl";
import { useApi } from "../api/apiService";
import type { ApiResponse } from "../Interface/Custom";
import { showSuccess } from "../Custom/CustomToast";

// ✅ Get all transports
export const useGetTransports = () => {
  const { callApi } = useApi();
  return useQuery({
    queryKey: ["transportList"],
    queryFn: async () => {
      const response = await callApi(`${apiUrls.transport}`, "GET");
      return (response as ApiResponse).data;
    },
    refetchOnWindowFocus: true,
  });
};

// ✅ Create new transport
export const useTransportCreate = () => {
  const queryClient = useQueryClient();
  const { callApi } = useApi();

  return useMutation({
    mutationFn: async (data: any) => {
      const response = await callApi(`${apiUrls.transport}`, "POST", data);
      return response as ApiResponse;
    },
    onSuccess: () => {
      showSuccess("Transport Created Successfully");
      queryClient.invalidateQueries({ queryKey: ["transportList"] });
    },
  });
};

// ✅ Update transport
export const useUpdateTransport = () => {
  const queryClient = useQueryClient();
  const { callApi } = useApi();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await callApi(`${apiUrls.transport}/${id}`, "PUT", data);
      return response as ApiResponse;
    },
    onSuccess: () => {
      showSuccess("Transport Updated Successfully");
      queryClient.invalidateQueries({ queryKey: ["transportList"] });
    },
  });
};

// ✅ Delete transport
export const useDeleteTransport = () => {
  const queryClient = useQueryClient();
  const { callApi } = useApi();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await callApi(`${apiUrls.transport}/${id}`, "DELETE");
      return response as ApiResponse;
    },
    onSuccess: () => {
      showSuccess("Transport Deleted Successfully");
      queryClient.invalidateQueries({ queryKey: ["transportList"] });
    },
  });
};
