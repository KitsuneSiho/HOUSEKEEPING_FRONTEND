import styles from "../../../css/chat/chatList.module.css";
import {useNavigate} from "react-router-dom";
import PropTypes from "prop-types";
import * as propTypes from "prop-types";

// 1대1 채팅 element
const SingleChatElement = ({chatRoom, timeFormatter}) => {

    const navigate = useNavigate();

    // 1대1 채팅 방에 입장
    const enterChatRoom = () => {

        navigate(`/chat/${chatRoom.chatRoomId}/${chatRoom.nickNameList[0]}`)
    }

    return (
        <>
            <img src="/lib/마이페이지아이콘.svg" alt="profile"/>
            <div
                className={styles.chatInfo}
                onClick={enterChatRoom}
            >
                <div className={styles.chatName}>{chatRoom.nickNameList[0]}</div>
                <div className={styles.chatMessage}>
                    {chatRoom.recentMessage}
                    {chatRoom.unreadMessageCount > 0 ? <>{` (N: ${chatRoom.unreadMessageCount})`}</> : <></>}
                </div>
            </div>
            <div className={styles.chatTime}>
                <span>{timeFormatter(chatRoom.chatRoomUpdatedAt)}</span>
            </div>
        </>
    )
}

SingleChatElement.propTypes = {
    chatRoom: PropTypes.object.isRequired,
    timeFormatter: propTypes.func.isRequired,
}

export default SingleChatElement