import styles from "../../../css/chat/chatList.module.css";
import {useNavigate} from "react-router-dom";
import PropTypes from "prop-types";
import * as propTypes from "prop-types";

const SingleChatElement = ({chatRoom, timeFormatter}) => {

    const navigate = useNavigate();

    return (
        <>
            <img src="/lib/마이페이지아이콘.svg" alt="profile"/>
            <div
                className={styles.chatInfo}
                onClick={() => navigate(`/chat/${chatRoom.chatRoomId}`)}
            >
                <div className={styles.chatName}>{chatRoom.nickNameList[0]}</div>
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

SingleChatElement.propTypes = {
    chatRoom: PropTypes.object.isRequired,
    timeFormatter: propTypes.func.isRequired,
}

export default SingleChatElement