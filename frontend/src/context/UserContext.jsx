import {
  useContext,
  useEffect,
  createContext,
  useCallback,
} from "react";
import api from "../api/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const queryClient = useQueryClient();

  const { data: user, isFetching: loading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      try {
        const userResponse = await api.get("/users/me");
        return userResponse.data;
      } catch (error) {
        if (error.response?.status === 401) {
          return null;
        }
        throw error;
      }
    },
    onError: (error) => {
      console.log(error);
      return null;
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const login = () => {
    queryClient.invalidateQueries(["user"]);
  };

  const logout = useCallback(async () => {
    try {
      // Call logout endpoint to clear server-side cookie
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear client-side data regardless of server response
      queryClient.setQueryData(["user"], null);
      queryClient.clear();
    }
  }, [queryClient]);

  return (
    <UserContext.Provider
      value={{ user, login, logout, loading }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
