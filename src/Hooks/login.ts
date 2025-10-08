import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiUrls } from "../api/apiUrl";
import { showSuccess } from "../Custom/CustomToast";
import { useApi } from "../api/apiService";

export const useLoginApi = () => {
  const queryClient = useQueryClient();
  const { callApi } = useApi();

  return useMutation({
    mutationFn: async (data: any) => {
      const response = await callApi(`${apiUrls.login}`, "POST", data);
      return response;
    },
    onSuccess: () => {
      showSuccess("Login Successful");
      // queryClient.invalidateQueries({queryKey: ["approveFlow"]});
    },
    onError: (error) => {
      console.error(error);
    },
  });
};
