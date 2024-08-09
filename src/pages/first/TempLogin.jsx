import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useSocket} from "../../contexts/SocketContext.jsx";

// 회원 번호를 입력해서 로그인. 임시로 만든거라서 나중에 삭제 예정
const TempLogin = () => {

    const {socketLogin} = useSocket();
    const [userId, setUserId] = useState("");
    const [nickname, setNickname] = useState("");
    const [input, setInput] = useState("");
    const navigate = useNavigate();

    const login = () => {
        if (nickname !== "") {
            socketLogin(nickname);
        }

        if (userId !== "" && input !== "") {
            sessionStorage.setItem("userId", userId);
            sessionStorage.setItem("userLevel", input);

            navigate("/test/room");
        }
    }

    return (
        <>
            회원번호:
            <input onChange={(e) => setUserId(e.target.value)}/>
            레벨:
            <input onChange={(e) => setInput(e.target.value)}/>
            <br/>
            닉네임:
            <input onChange={(e) => setNickname(e.target.value)}/>
            <br/>
            <button onClick={login}>임시 로그인하기</button>
        </>
    )
}

export default TempLogin