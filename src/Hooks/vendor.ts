import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiUrls } from "../api/apiUrl";
import { useApi } from "../api/apiService";
import type { ApiResponse } from "../Interface/Custom";
import { showSuccess } from "../Custom/CustomToast";

export const useGetVendors = () => {
  const { callApi } = useApi();
  return useQuery({
    queryKey: ["vendorList"],
    queryFn: async () => {
      const response = await callApi(`${apiUrls.vendor}`, "GET");
      return (response as ApiResponse).data;
    },
    refetchOnWindowFocus: true,
  });
};

export const useVendorCreate = () => {
  const queryClient = useQueryClient();
  const { callApi } = useApi();

  return useMutation({
    mutationFn: async (data: any) => {
      const response = await callApi(`${apiUrls.vendor}`, "POST", data);
      return response as ApiResponse;
    },
    onSuccess: () => {
      showSuccess("Vendor Created Successfully");
      queryClient.invalidateQueries({ queryKey: ["vendorList"] });
    },
  });
};

export const useUpdateVendor = () => {
  const queryClient = useQueryClient();
  const { callApi } = useApi();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await callApi(`${apiUrls.vendor}/${id}`, "PUT", data);
      return response as ApiResponse;
    },
    onSuccess: () => {
      showSuccess("Vendor updated Successfully");
      queryClient.invalidateQueries({ queryKey: ["vendorList"] });
    },
  });
};

export const useDeleteVendor = () => {
  const queryClient = useQueryClient();
  const { callApi } = useApi();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await callApi(`${apiUrls.vendor}/${id}`, "DELETE");
      return response as ApiResponse;
    },
    onSuccess: () => {
      showSuccess("Vendor deleted Successfully");
      queryClient.invalidateQueries({ queryKey: ["vendorList"] });
    },
  });
};
