import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useSocket} from "../context/SocketContext.jsx";

const ChatLogin = () => {

    const {socketLogin, setOnline, getOnlineFriends} = useSocket();
    const [userId, setUserId] = useState("");
    const [input, setInput] = useState("");
    const navigate = useNavigate();

    const login = () => {
        if (userId !== "" && input !== "") {
            sessionStorage.setItem("userId", userId);
            sessionStorage.setItem("nickname", input);

            socketLogin(input);
            setOnline(userId, true);
            getOnlineFriends(userId);

            navigate("/chat");
        }
    }

    return (
        <>
            회원번호:
            <input onChange={(e) => setUserId(e.target.value)}/>
            닉네임:
            <input onChange={(e) => setInput(e.target.value)}/>
            <br/>
            <button onClick={login}>임시 로그인하기</button>
        </>
    )
}

export default ChatLogin