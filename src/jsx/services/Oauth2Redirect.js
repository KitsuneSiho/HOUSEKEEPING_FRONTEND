import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLogin } from "../contexts/AuthContext";

const OAuth2Redirect = () => {
    const navigate = useNavigate();
    const { setIsLoggedIn, setLoginUser } = useLogin();
    const [queryParams] = useSearchParams();

    const OAuth2JwtHeaderFetch = async () => {
        try {
            const response = await fetch("http://localhost:8080/oauth2-jwt-header", {
                method: "POST",
                credentials: "include",
            });

            if (response.ok) {
                const accessToken = response.headers.get("access");
                const refreshToken = response.headers.get("refresh");
                window.localStorage.setItem("access", accessToken);
                window.localStorage.setItem("refresh", refreshToken);
                const name = queryParams.get('name');
                window.localStorage.setItem("name", name);

                setIsLoggedIn(true);
                setLoginUser(name);

                // 사용자 정보 확인
                const userInfoResponse = await fetch('http://localhost:8080/api/user/info', {
                    headers: { 'Authorization': `Bearer ${accessToken}` }
                });
                const userInfo = await userInfoResponse.json();

                if (userInfo.registrationComplete) {
                    navigate('/main', { replace: true });
                } else {
                    const params = new URLSearchParams({
                        token: accessToken,
                        name: userInfo.name,
                        email: userInfo.email,
                        provider: userInfo.userPlatform,
                        phoneNumber: userInfo.phoneNumber || ''
                    });
                    navigate(`/firstLogin?${params.toString()}`, { replace: true });
                }
            } else {
                alert('접근할 수 없는 페이지입니다.');
                navigate('/login', { replace: true });
            }
        } catch (error) {
            console.log("error: ", error);
            navigate('/login', { replace: true });
        }
    }

    useEffect(() => {
        OAuth2JwtHeaderFetch();
    }, []);

    return null;
};

export default OAuth2Redirect;