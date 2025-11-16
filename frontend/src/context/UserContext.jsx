import { useContext, useState, useEffect, createContext, useCallback } from "react";
import { useCookies } from "react-cookie";
import { jwtDecode } from 'jwt-decode';
import api from "../api/api";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [cookies, setCookie, removeCookie] = useCookies(["token"]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUserLoggedIn = async () => {
            const token = cookies.token;

            setLoading(true);

            if (!token) {
                setUser(null);
                setLoading(false);
                return;
            }

            try {
                const decoded = jwtDecode(token);

                if (decoded.exp * 1000 < Date.now()) {
                    logout();
                    setLoading(false);
                    return;
                }
                
                const { data: userData } = await api.get("/users/me", {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    }
                });

                console.log(userData);
                setUser(userData);
            } catch (error) {
                console.warn("Invalid Token");
                logout();
            }

            setLoading(false);
        }

        checkUserLoggedIn();
    }, [cookies.token]);

    const login = (tokenValue, user) => {
        setCookie("token", tokenValue, { path: "/", secure: false, sameSite: 'strict' });
        setUser(user);
    }

    const logout = useCallback(() => {
        removeCookie("token", { path: '/' });
        setUser(null);
    }, []);

    // intercept invalid tokens as responses and auto-logout user
    useEffect(() => {
        const invalidTokenInterceptor = api.interceptors.response.use(
            res => res,
            error => {
                if (error.response?.status === 401 && error.response?.data?.error.includes('token')) {
                    logout();
                }
                console.log('test');
                return Promise.reject(error);
            }
        )

        return () => {
            api.interceptors.response.eject(invalidTokenInterceptor);
        }
    }, [logout]);

    return (
        <UserContext.Provider value={{ user, login, logout, cookies, setCookie, removeCookie, loading }}>
            {children}
        </UserContext.Provider>
    );
}

export const useUser = () => {
    return useContext(UserContext);
}