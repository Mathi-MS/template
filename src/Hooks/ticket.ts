import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiUrls } from "../api/apiUrl";
import type { ApiResponse } from "../Interface/Custom";
import { useApi } from "../api/apiService";
import { showSuccess } from "../Custom/CustomToast";

export const useGetMyTickets = (search?: string) => {
  const { callApi } = useApi();
  return useQuery({
    queryKey: ["myTickets", search],
    queryFn: async () => {
      const url = search
        ? `${apiUrls.rideTicket}/my-tickets?search=${search}`
        : `${apiUrls.rideTicket}/my-tickets`;
      const response = await callApi(url, "GET");
      return (response as ApiResponse).data;
    },
    refetchOnWindowFocus: true,
  });
};

export const useCreateRideTicket = () => {
  const queryClient = useQueryClient();
  const { callApi } = useApi();

  return useMutation({
    mutationFn: async (data: any) => {
      const response = await callApi(
        `${apiUrls.rideTicket}/create`,
        "POST",
        data
      );
      return response as ApiResponse;
    },
    onSuccess: () => {
      showSuccess("Ride ticket created successfully");
      queryClient.invalidateQueries({ queryKey: ["myTickets"] });
    },
  });
};

export const useSendOtp = () => {
  const { callApi } = useApi();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await callApi(
        `${apiUrls.rideTicket}/send-otp/${id}`,
        "GET"
      );
      return response as ApiResponse<string>;
    },
  });
};

export const useVerifyOtp = () => {
  const { callApi } = useApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, otp }: { id: string; otp: string }) => {
      const response = await callApi(
        `${apiUrls.rideTicket}/verify-otp/${id}?otp=${otp}`,
        "POST"
      );
      return response as ApiResponse<string>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myTickets"] });
    }
  });
};

export const useUpdateRemarks = () => {
  const queryClient = useQueryClient();
  const { callApi } = useApi();

  return useMutation({
    mutationFn: async ({
      id,
      remarks,
      dropLocation,
    }: {
      id: string;
      remarks?: string;
      dropLocation?: string;
    }) => {
      let url = `${apiUrls.rideTicket}/update-remarks/${id}`;

      const params = new URLSearchParams();

      if (remarks) params.append("remarks", remarks);
      if (dropLocation) params.append("dropLocation", dropLocation);
       params.append("status", "Completed");
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      const response = await callApi(url, "PUT");
      return response as ApiResponse;
    },

    onSuccess: () => {
      showSuccess("Remarks updated successfully");
      queryClient.invalidateQueries({ queryKey: ["myTickets"] });
    },
  });
};

