import styles from "../../../css/chat/chatRoom.module.css";
import PropTypes from "prop-types";
import {useEffect, useState} from "react";

const MessageElement = ({message, userId}) => {

    const [messageType, setMessageType] = useState("");

    useEffect(() => {
        if (Number(message.messageSenderId) === Number(userId)) {
            setMessageType("sent");
        } else {
            setMessageType("received");
        }
    }, [message]);

    // LocalDateTime을 알맞은 형태로 가공
    const timeFormatter = (dateTimeString) => {
        const dateTime = new Date(dateTimeString);

        let hour = dateTime.getHours();
        let minute = dateTime.getMinutes();

        if (hour < 10) {
            hour = "0" + hour;
        }

        if (minute < 10) {
            minute = "0" + minute;
        }

        return `${hour}:${minute}`;
    }

    return (
        <>
            <div className={`${styles.message} ${styles[messageType]}`}>
                <img src="/lib/마이페이지아이콘.svg" alt="profile"/>
                <div>{message.messageSenderNickname}</div>
                <div className={styles.messageContent}>
                    <p>{message.messageContent}</p>
                </div>
                <span className={styles.messageTime}>{timeFormatter(message.messageTimestamp)}</span>
            </div>
        </>
    )
}

MessageElement.propTypes = {
    message: PropTypes.object,
    userId: PropTypes.string,
}

export default MessageElement