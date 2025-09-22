import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { callApi } from "../api/apiService";
import { apiUrls } from "../api/apiUrl";
import type { ApiResponse } from "../Interface/interface";

export const usePayoutUploadApi = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await callApi(apiUrls.payoutUpload, "POST", formData);
      return response as ApiResponse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payouts"] });
    },
    onError: (error) => {
      console.error("Payout upload failed:", error);
    },
  });
};

export const usePayoutMultipleUploadApi = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await callApi(
        apiUrls.payoutMultipleUpload,
        "POST",
        formData
      );
      return response as ApiResponse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payouts"] });
    },
    onError: (error) => {
      console.error("Payout upload failed:", error);
    },
  });
};


// export const useOutletDashboardQuery = () => {
//     return useQuery({
//         queryKey: ["outletDashboard"],
//         queryFn: async () => {
//             try {
//                 const response = await callApi(apiUrls.outletDashboard, "GET");
//                 return response as ApiResponse;
//             } catch (error) {
//                 throw error;
//             }
//         },
//     });
// };

export const useOutletDashboardQuery = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (formData: any) => {
            const response = await callApi(apiUrls.outletDashboard, "POST", formData);
            return response as ApiResponse;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["outlets"] });
        },
        onError: (error) => {
            console.error("Outlets upload failed:", error);
        }
    });
};

export const useOutletPayoutByIdQuery = (id: string) => {
  return useQuery({
    queryKey: ["outletPayoutById", id],
    queryFn: async () => {
      try {
        const response = await callApi(
          `${apiUrls.outletPayoutById}/${id}`,
          "GET"
        );
        return response as ApiResponse;
      } catch (error) {
        throw error;
      }
    },
  });
};

export const useOutletsQuery = () => {
  return useQuery({
    queryKey: ["outlets"],
    queryFn: async () => {
      try {
        const response = await callApi(apiUrls.outlets, "GET");
        return response as ApiResponse;
      } catch (err) {
        throw err;
      }
    },
  });
};

export const useoutletByNameQuery = () => {
  return useQuery({
    queryKey: ["outletsByName"],
    queryFn: async () => {
      try {
        const response = await callApi(apiUrls.outletByName, "GET");
        return response as ApiResponse;
      } catch (err) {
        throw err;
      }
    },
  });
};

export const usePayoutsQuery = () => {
  return useQuery({
    queryKey: ["payouts"],
    queryFn: async () => {
      try {
        const response = await callApi(apiUrls.payout, "GET");
        return response as ApiResponse;
      } catch (err) {
        throw err;
      }
    },
  });
};

export const useOutletByIdQuery = (id: string) => {
  return useQuery({
    queryKey: ["outletById", id],
    queryFn: async () => {
      try {
        const response = await callApi(`${apiUrls.outletById}/${id}`, "GET");
        return response as ApiResponse;
      } catch (err) {
        throw err;
      }
    },
  });
};

export const useOutletsApi = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: any) => {
      const response = await callApi(apiUrls.outlets, "POST", formData);
      return response as ApiResponse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outlets"] });
    },
    onError: (error) => {
      console.error("Outlets upload failed:", error);
    },
  });
};
export const useOutletUpdateApi = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: any) => {
      const response = await callApi(
        `${apiUrls.outletById}/` + id,
        "PUT",
        formData
      );
      return response as ApiResponse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outlets"] });
    },
    onError: (error) => {
      console.error("Outlets upload failed:", error);
    },
  });
};

export const useOutletDeleteApi = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await callApi(`${apiUrls.outletById}/${id}`, "DELETE");
      return response as ApiResponse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outlets"] });
    },
    onError: (error) => {
      console.error("Outlet delete failed:", error);
    },
  });
};

// export const useDashboardCountQuery = () => {
//     return useQuery({
//         queryKey: ["dashbosrdCount"],
//         queryFn: async () => {
//             try {
//                 const response = await callApi(apiUrls.dashboardCount, "GET");
//                 return response as ApiResponse;
//             } catch (err) {
//                 throw err;
//             }
//         }
//     })
// }


export const useOutletByPayoutQuery = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (formData: any) => {
            const response = await callApi(apiUrls.outletByPayout, "POST", formData);
            return response as ApiResponse;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["outlets"] });
        },
        onError: (error) => {
            console.error("Outlets upload failed:", error);
        }
    });
};
export const useLastPayoutQuery = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (formData: any) => {
            const response = await callApi(apiUrls.lastPayout, "POST", formData);
            return response as ApiResponse;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["outlets"] });
        },
        onError: (error) => {
            console.error("Outlets upload failed:", error);
        }
    });
};

export const useDashboardCountQuery = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (formData: any) => {
            const response = await callApi(apiUrls.dashboardCount, "POST", formData);
            return response as ApiResponse;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["outlets"] });
        },
        onError: (error) => {
            console.error("Outlets upload failed:", error);
        }
    });
};


