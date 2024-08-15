import styles from "../../css/chat/chatList.module.css";
import {useNavigate} from "react-router-dom";
import PropTypes from "prop-types";
import * as propTypes from "prop-types";
import {useEffect, useState} from "react";
import axiosInstance from "../../config/axiosInstance.js";
import {useLogin} from "../../contexts/AuthContext.jsx";

// 1대1 채팅 element
const ChatRoom = ({chatRoom, timeFormatter}) => {

    const {user} = useLogin();
    const [userImage, setUserImage] = useState(null);
    const [chatRoomMembers, setChatRoomMembers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {

        if (chatRoom.chatRoomType === "SINGLE") {
            getChatRoomMembers();
        }
    }, [chatRoom])

    // 1대1 채팅 방에 입장
    const enterChatRoom = () => {

        navigate(`/chat/${chatRoom.chatRoomId}`)
    }

    // 채팅 방 멤버를 받아옴
    const getChatRoomMembers = async () => {

        try {

            const result = await axiosInstance.get(`/chat/room/member/list?chatRoomId=${chatRoom.chatRoomId}&userId=${user.userId}`);

            setChatRoomMembers(result.data);
        } catch (error) {
            console.error("error getting room members:", error);
        }
    }

    return (
        <>
            {chatRoom.chatRoomType === "SINGLE" ? (
                    userImage !== null ?
                        // 1대1 채팅 방에서 상대방의 이미지가 있을 경우
                        <img src={userImage} alt="single"/> :
                        // 1대1 채팅 방에서 상대방의 이미지가 없을 경우
                        <img src="/lib/마이페이지아이콘.svg" alt="single"/>) :
                // 단체 채팅 방일 경우
                <img src="/lib/마이페이지아이콘.svg" alt="group"/>}
            <div
                className={styles.chatInfo}
                onClick={enterChatRoom}
            >
                <div className={styles.chatName}>{chatRoom.chatRoomType === "SINGLE" ?
                    (chatRoomMembers[0]) :
                    (chatRoom.chatRoomName)}</div>
                <div className={styles.chatMessage}>
                    <div className={styles.recentMessageArea}>
                        {chatRoom.recentMessage}
                    </div>
                </div>
            </div>
            <div className={styles.unreadCountArea}>
                {chatRoom.unreadMessageCount > 0 &&
                    <span className={styles.unreadCount}>
                        {chatRoom.unreadMessageCount}
                    </span>
                }
            </div>
            <div className={styles.chatTime}>
                <span>{timeFormatter(chatRoom.chatRoomUpdatedAt)}</span>
            </div>
        </>
    )
}

ChatRoom.propTypes = {
    chatRoom: PropTypes.object.isRequired,
    timeFormatter: propTypes.func.isRequired
}

export default ChatRoom