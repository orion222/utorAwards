import {
  useContext,
  useEffect,
  createContext,
  useCallback,
} from "react";
import api from "../api/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const UserContext = createContext();
const contextResetFunctions = [];

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
    staleTime: 0,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    refreshCsrf();
  }, []);

  const refreshCsrf = async () => {
    try {
      const { data } = await api.get("/auth/csrf-token");
      api.defaults.headers.common["x-csrf-token"] = data.token;
    } catch (err) {
      console.warn("Failed to load CSRF token", err);
    }
  };

  const login = async () => {
    queryClient.invalidateQueries(["user"]);
    await refreshCsrf();
  };

  const logout = useCallback(() => {
    queryClient.setQueryData(["user"], null);
    queryClient.clear();

    contextResetFunctions.forEach(resetFn => {
      try {
        resetFn();
      } catch (error) {
        console.error("Error resetting context:", error);
      }
    });
  }, [queryClient]);

  const addResetContextFunction = useCallback((resetFn) => {
    if (typeof resetFn === 'function' && !contextResetFunctions.includes(resetFn)) {
      contextResetFunctions.push(resetFn);
    }
  }, []);

  const removeResetContextFunction = useCallback((resetFn) => {
    const index = contextResetFunctions.indexOf(resetFn);
    if (index > -1) {
      contextResetFunctions.splice(index, 1);
    }
  }, []);

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
      value={{ user, login, logout, loading, addResetContextFunction, removeResetContextFunction }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
