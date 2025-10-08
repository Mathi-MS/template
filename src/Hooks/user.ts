import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiUrls } from "../api/apiUrl";
import { useApi } from "../api/apiService";
import type { ApiResponse } from "../Interface/Custom";
import { showSuccess } from "../Custom/CustomToast";

// ✅ Get all users
export const useGetUsers = () => {
  const { callApi } = useApi();
  return useQuery({
    queryKey: ["userList"],
    queryFn: async () => {
      const response = await callApi(`${apiUrls.user}`, "GET");
      return (response as ApiResponse).data;
    },
    refetchOnWindowFocus: true,
  });
};

// ✅ Create user
export const useUserCreate = () => {
  const queryClient = useQueryClient();
  const { callApi } = useApi();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await callApi(`${apiUrls.user}`, "POST", data);
      return response as ApiResponse;
    },
    onSuccess: () => {
      showSuccess("User Created Successfully");
      queryClient.invalidateQueries({ queryKey: ["userList"] });
    },
  });
};

// ✅ Update user
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const { callApi } = useApi();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await callApi(`${apiUrls.user}/${id}`, "PUT", data);
      return response as ApiResponse;
    },
    onSuccess: () => {
      showSuccess("User Updated Successfully");
      queryClient.invalidateQueries({ queryKey: ["userList"] });
    },
  });
};

// ✅ Delete user
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const { callApi } = useApi();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await callApi(`${apiUrls.user}/${id}`, "DELETE");
      return response as ApiResponse;
    },
    onSuccess: () => {
      showSuccess("User Deleted Successfully");
      queryClient.invalidateQueries({ queryKey: ["userList"] });
    },
  });
};

// ✅ Get transports by selected pickup location
export const useGetTransportsByLocation = (locationId?: string) => {
  const { callApi } = useApi();

  return useQuery({
    queryKey: ["transportsByLocation", locationId],
    queryFn: async () => {
      if (!locationId) return [];
      const response = await callApi(
        `${apiUrls.transport}/city/${locationId}`,
        "GET"
      );
      return (response as ApiResponse).data;
    },
    enabled: !!locationId, 
  });
};
