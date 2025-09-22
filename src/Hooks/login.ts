import { useMutation, useQueryClient } from "@tanstack/react-query";
import { callApi } from "../api/apiService";
import { apiUrls } from "../api/apiUrl";
import type { ApiResponse } from "../Interface/Custom";

export const useLoginApi = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await callApi(`${apiUrls.login}`, "POST", data);
      return response as ApiResponse;
    },
    onSuccess: () => {
      // queryClient.invalidateQueries({queryKey: ["approveFlow"]});
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

