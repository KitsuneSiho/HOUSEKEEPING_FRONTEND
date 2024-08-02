import styles from "../../css/chat/chatList.module.css";
import {useNavigate} from "react-router-dom";
import PropTypes from "prop-types";
import * as propTypes from "prop-types";

// 1대1 채팅 element
const ChatRoom = ({chatRoom, timeFormatter}) => {

    const navigate = useNavigate();

    // 1대1 채팅 방에 입장
    const enterChatRoom = () => {

        navigate(`/chat/${chatRoom.chatRoomId}`)
    }

    return (
        <>
            <img src="/lib/마이페이지아이콘.svg" alt="profile"/>
            <div
                className={styles.chatInfo}
                onClick={enterChatRoom}
            >
                <div className={styles.chatName}>{chatRoom.chatRoomName}</div>
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
    timeFormatter: propTypes.func.isRequired,
}

export default ChatRoom