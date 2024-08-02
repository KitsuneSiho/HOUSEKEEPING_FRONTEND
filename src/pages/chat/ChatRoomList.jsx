import {useNavigate} from 'react-router-dom';
import styles from '../../css/chat/chatList.module.css';
import Footer from '../../jsx/fix/Footer.jsx';
import {useEffect, useState} from "react";
import axios from "axios";
import {BACK_URL} from "../../Constraints.js"
import ChatRoom from "../../components/chat/ChatRoom.jsx";
import ChatAlarm from "./ChatAlarm.jsx";
import FriendTop from "../../components/friend/FriendTop.jsx";
import {useSocket} from "../../components/context/SocketContext.jsx";

// 채팅 방 리스르 출력
const ChatRoomList = () => {

    const {friendMessage, setFriendMessage} = useSocket();
    const [userId, setUserId] = useState(null);
    const [chatRooms, setChatRooms] = useState(null);
    const [isReady, setIsReady] = useState(false);
    const navigate = useNavigate();

    // 마운트 시 세션에서 유저 아이디를 받아옴
    useEffect(() => {
        setUserId(sessionStorage.getItem("userId"));
    }, []);

    // 방 리스트를 받고 페이지를 준비 상태로 업데이트
    useEffect(() => {
        if (userId !== null) {
            getRoomList().then(() => {
                setIsReady(true);
            });
        }
    }, [userId]);

    // 채팅 수신 시 실행
    useEffect(() => {

        if (friendMessage !== "") {

            getRoomList().then(() => setFriendMessage(""));
        }

    }, [friendMessage]);

    // 방의 리스트를 받아오는 함수
    const getRoomList = async () => {

        try {
            const response = await axios.get(`${BACK_URL}/chat/room/list?userId=${userId}`)
            setChatRooms(response.data);
        } catch (error) {
            console.error('Error getting RoomList: ', error);
        }
    }

    // 방 생성 버튼을 누를 시 실행
    const createChatRoom = () => {
        navigate("/chat/create");
    }

    // LocalDateTime을 알맞은 형태로 가공
    const timeFormatter = (dateTimeString) => {

        const now = new Date();
        const dateTime = new Date(dateTimeString);

        const diffInSeconds = Math.floor((now - dateTime) / 1000);
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        const diffInHours = Math.floor(diffInMinutes / 60);
        const diffInDays = Math.floor(diffInHours / 24);
        const diffInYears = Math.floor(diffInDays / 365);

        if (diffInYears > 0) {
            return `${diffInYears}년 전`;
        } else if (diffInDays > 0) {
            return `${diffInDays}일 전`;
        } else if (diffInHours > 0) {
            return `${diffInHours}시간 전`;
        } else if (diffInMinutes) {
            return `${diffInMinutes}분 전`;
        } else {
            return `방금 전`;
        }
    }

    return (
        <div className={styles.container}>
            {/*<FriendTop />*/}
            <div className={styles.header}>
                <img
                    className={styles.back}
                    src="/lib/back.svg"
                    alt="back"
                    onClick={() => navigate('/mainPage')}
                />
                <h2>채팅</h2>
                <img
                    className={styles.createChat}
                    src="/lib/채팅생성.svg"
                    alt="create-chat"
                    onClick={createChatRoom}
                />
            </div>
            <div className={styles.chatList}>
                {/*페이지가 준비 상태가 아닐 경우 출력 안함*/}
                {isReady && chatRooms.map((chatRoom, index) => (
                    <div key={index} className={styles.chatItem}>
                        {chatRoom.chatRoomType === "SINGLE" || chatRoom.chatRoomType === "GROUP" ? (
                            <ChatRoom chatRoom={chatRoom} timeFormatter={timeFormatter}/>
                        ) : (
                            <>
                                {() => console.log("chat room type error: " + chatRoom.chatRoomType)}
                            </>
                        )}
                    </div>
                ))}
            </div>
            <ChatAlarm />
            <Footer/>
        </div>
    );
};

export default ChatRoomList;
