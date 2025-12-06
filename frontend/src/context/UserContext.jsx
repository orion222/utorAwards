import {
  useContext,
  useEffect,
  createContext,
  useCallback,
} from "react";
import { jwtDecode } from "jwt-decode";
import api from "../api/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const queryClient = useQueryClient();

  const { data: user, isFetching: loading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        return null;
      }

      const decoded = jwtDecode(token);

      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        return null;
      }

      const res = await api.get("/users/me");
      return res.data;
    },
    onError: (error) => {
      console.log(error);
      logout();
      return null;
    },
    retry: false,
    staleTime: 0,
    refetchOnWindowFocus: false,
  });

  const login = (tokenValue) => {
    localStorage.setItem("token", tokenValue);
    queryClient.invalidateQueries(["user"]);
  };

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    queryClient.setQueryData(["user"], null);
    queryClient.clear();
  }, [queryClient]);

  // intercept invalid tokens as responses and auto-logout user
  useEffect(() => {
    const invalidTokenInterceptor = api.interceptors.response.use(
      (res) => res,
      (error) => {
        if (
          error.response?.status === 401 &&
          error.response?.data?.error.includes("token")
        ) {
          logout();
        }
        return Promise.reject(error);
      },
    );

    return () => {
      api.interceptors.response.eject(invalidTokenInterceptor);
    };
  }, [logout]);

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
