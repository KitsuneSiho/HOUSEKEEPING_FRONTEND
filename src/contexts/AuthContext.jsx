import React, { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../config/axiosInstance";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('access');
        if (token) {
            const decodedToken = jwtDecode(token);
            if (decodedToken.exp * 1000 > Date.now()) {
                setIsLoggedIn(true);
                setUser({
                    userId: decodedToken.userId,
                    nickname: decodedToken.nickname,
                });
                fetchUserInfo(decodedToken.userId);
            } else {
                localStorage.removeItem('access');
            }
        }
    }, []);

    const fetchUserInfo = async (userId) => {
        try {
            const response = await axiosInstance.get(`/api/user/info?userId=${userId}`);
            setUser(prevUser => ({
                ...prevUser,
                ...response.data,
                profileImageUrl: response.data.profileImageUrl
            }));
        } catch (error) {
            console.error('Error fetching user info', error);
        }
    };

    const login = (token) => {
        localStorage.setItem('access', token);
        setIsLoggedIn(true);
        const decodedToken = jwtDecode(token);
        setUser({
            userId: decodedToken.userId,
            nickname: decodedToken.nickname,
        });
        fetchUserInfo(decodedToken.userId);
    };

    const logout = () => {
        localStorage.removeItem('access');
        document.cookie = "refresh=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        setIsLoggedIn(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, user, setUser, login, logout, fetchUserInfo }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
export const useLogin = useAuth;
export default AuthProvider;