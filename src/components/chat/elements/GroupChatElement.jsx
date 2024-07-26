import {useNavigate} from "react-router-dom";
import styles from "../../../css/chat/chatList.module.css";
import PropTypes from "prop-types";
import * as propTypes from "prop-types";

const GroupChatElement = ({chatRoom, timeFormatter}) => {

    const navigate = useNavigate();

    return (
        <>
            {/*그룹체팅 아이콘도 따로 만들어야 할듯*/}
            <img src="/lib/마이페이지아이콘.svg" alt="profile"/>
            <div
                className={styles.chatInfo}
                onClick={() => navigate(`/chat/${chatRoom.chatRoomId}`)}
            >
                <div className={styles.chatName}>{chatRoom.chatRoomName}</div>
                <div className={styles.chatMessage}>
                    {chatRoom.recentMessage}
                    {chatRoom.unreadMessageCount > 0 ? <>(N)</> : <></>}
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