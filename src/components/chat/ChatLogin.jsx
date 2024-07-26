import {useState} from "react";
import {useNavigate} from "react-router-dom";

const ChatLogin = () => {

    const [userId, setUserId] = useState(null);
    const [nickname, setNickname] = useState(null);
    const navigate = useNavigate();

    const login = () => {
        if (nickname || nickname) {
            sessionStorage.setItem("userId", userId);
            sessionStorage.setItem("nickname", nickname);

            navigate("/chat");
        }
    }

    return (
        <>
            회원번호:
            <input onChange={(e) => setUserId(e.target.value)}/>
            닉네임:
            <input onChange={(e) => setNickname(e.target.value)}/>
            <br/>
            <button onClick={login}>임시 로그인하기</button>
        </>
    )
}

export default ChatLogin