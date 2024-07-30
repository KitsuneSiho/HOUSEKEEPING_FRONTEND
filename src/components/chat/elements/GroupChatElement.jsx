import {useNavigate} from "react-router-dom";
import styles from "../../../css/chat/chatList.module.css";
import PropTypes from "prop-types";
import * as propTypes from "prop-types";

// 그룹채팅 element
const GroupChatElement = ({chatRoom, timeFormatter}) => {

    const navigate = useNavigate();

    // 그룹채팅 방 입장
    const enterChatRoom = () => {

        navigate(`/chat/${chatRoom.chatRoomId}/${chatRoom.chatRoomName}`)
    }

    return (
        <>
            {/*그룹체팅 아이콘도 따로 만들어야 할듯*/}
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

                    <div className={styles.unreadCountArea}>
                        {chatRoom.unreadMessageCount > 0 &&
                            <span className={styles.unreadCount}>
                            {chatRoom.unreadMessageCount}
                        </span>
                        }
                    </div>
                </div>
            </div>
            <div className={styles.chatTime}>
                <span>{timeFormatter(chatRoom.chatRoomUpdatedAt)}</span>
            </div>
        </>
    )
}

GroupChatElement.propTypes = {
    chatRoom: PropTypes.object.isRequired,
    timeFormatter: propTypes.func.isRequired,
}

export default GroupChatElement