import styles from "../../../css/chat/chatRoom.module.css";
import PropTypes from "prop-types";
import {useEffect, useState} from "react";

const MessageElement = ({message, userId}) => {

    const [messageType, setMessageType] = useState("");
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {

        if (Number(message.messageSenderId) === Number(userId)) {
            setMessageType("sent");
        } else {
            setMessageType("received");
        }

    }, [message]);

    useEffect(() => {

        if (messageType !== "") {
            setTimeout(() => setIsReady(true), 100);
        }
    }, [messageType])

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

        isReady && <div className={`${styles.message} ${styles[messageType]}`}>
            <img src="/lib/마이페이지아이콘.svg" alt="profile"/>
            <div>{message.messageSenderNickname}</div>
            <div className={styles.messageContent}>
                <p>{message.messageContent}</p>
            </div>
            <span className={styles.messageTime}>{timeFormatter(message.messageTimestamp)}</span>
        </div>
    );
}

MessageElement.propTypes = {
    message: PropTypes.object.isRequired,
    userId: PropTypes.string.isRequired,
}

export default MessageElement;
