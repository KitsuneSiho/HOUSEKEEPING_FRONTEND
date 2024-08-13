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
                    // 기타 토큰에 포함된 사용자 정보
                });
            } else {
                localStorage.removeItem('access');
            }
        }
    }, []);

    const fetchUserInfo = async () => {
        try {
            const response = await axiosInstance.get('/api/user/info');
            setUser(response.data);
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
            // 기타 토큰에 포함된 사용자 정보
        });
        // 추가 정보가 필요한 경우에만 fetchUserInfo 호출
        // fetchUserInfo();
    };

    const logout = () => {
        localStorage.removeItem('access');
        setIsLoggedIn(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, user, login, logout, fetchUserInfo }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
export const useLogin = useAuth;
export default AuthProvider;
