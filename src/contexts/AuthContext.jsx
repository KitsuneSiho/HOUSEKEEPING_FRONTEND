import {createContext, useContext, useEffect, useState} from "react";

// 로그인 상태 전역적으로 쓰기 위해 context api 사용 -> prop drilling 을 피함
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    // 기본적으로 로컬 스토리지의 access 값을 기준으로 setting
    const [isLoggedIn, setIsLoggedIn] = useState(!!window.localStorage.getItem('access'));
    const [loginUserId, setLoginUserId] = useState(window.localStorage.getItem('userId'));
    const [loginNickname, setLoginNickname] = useState(window.localStorage.getItem('nickname'));

    useEffect(() => {

        console.log(isLoggedIn, loginUserId, loginNickname);
    }, [isLoggedIn, loginUserId, loginNickname]);

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, loginUserId, setLoginUserId, loginNickname, setLoginNickname }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useLogin = () => useContext(AuthContext);
export default AuthProvider;