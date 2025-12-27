import { UserApiEntity } from "@/app/api/user/types";
import { ApiResponse } from "@/app/api/types";
import { useQuery } from "@tanstack/react-query";

interface UseGetUserResponse {
  user: UserApiEntity | null;
  isLoading: boolean;
  error: Error | null;
}

function useGetUser(): UseGetUserResponse {
  const { data, isLoading, error } = useQuery<ApiResponse<UserApiEntity>>({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await fetch("/api/user");
      return await res.json();
    },
  });

  if (!data) {
    return { user: null, isLoading, error: new Error("Failed to fetch user") };
  }

  return { user: data.data, isLoading, error };
}

export default useGetUser;
