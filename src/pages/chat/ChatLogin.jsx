import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useSocket} from "../../components/context/SocketContext.jsx";

// 회원 번호와 닉네임을 입력해서 로그인. 임시로 만든거라서 나중에 삭제 예정
const ChatLogin = () => {

    const {socketLogin} = useSocket();
    const [userId, setUserId] = useState("");
    const [input, setInput] = useState("");
    const navigate = useNavigate();

    const login = () => {
        if (userId !== "" && input !== "") {
            sessionStorage.setItem("userId", userId);
            sessionStorage.setItem("nickname", input);

            socketLogin(input);

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