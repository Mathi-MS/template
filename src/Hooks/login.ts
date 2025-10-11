import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiUrls } from "../api/apiUrl";
import { showError, showSuccess } from "../Custom/CustomToast";
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
      showError(error?.message);
    },
  });
};

export const useSendResetLink = () => {
  const { callApi } = useApi();

  return useMutation({
    mutationFn: async (email: string) => {
      const url = `${apiUrls.reset}/${email}`;
      const response = await callApi(url, "GET");
      console.log(response);
      
      return response;
    },
    onSuccess: () => {
      showSuccess("Reset link sent to your email address.");
    },
    onError: (error: any) => {
      showError(error?.message || "Failed to send reset link.");
    },
  });
};

export const useResetPassword = () => {
  const { callApi } = useApi();

  return useMutation({
    mutationFn: async (data: {
      password: string;
      token: string;
    }) => {
      const response = await callApi(
        `${apiUrls.auth}/forgot-password`,
        "PUT",
        data
      );
      return response;
    },
    onSuccess: (response: any) => {
      showSuccess(response?.message || "Password changed successfully.");
    },
    onError: (error: any) => {
      showError(error?.message || "Failed to reset password.");
    },
  });
};
