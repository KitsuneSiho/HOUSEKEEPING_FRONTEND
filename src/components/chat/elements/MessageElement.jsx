import styles from "../../../css/chat/chatRoom.module.css";
import PropTypes from "prop-types";
import {useEffect, useState} from "react";

// 메시지 element
const MessageElement = ({message, userId, scrollToBottom}) => {

    const [messageType, setMessageType] = useState("");
    const [isReady, setIsReady] = useState(false);

    // 내가 보낸 메시지인지, 받은 메시지인지 구별
    useEffect(() => {

        if (Number(message.messageSenderId) === Number(userId)) {
            setMessageType("sent");
        } else {
            setMessageType("received");
        }

    }, [message]);

    // 처음 마운트 시 무조건 한번은 received 타입으로 지정되는 이슈 때문에 0.1초 동안은 메시지를 표시하지 않음
    useEffect(() => {

        if (messageType !== "") {
            setTimeout(() => setIsReady(true), 100);
        }
    }, [messageType])

    // 준비가 끝나면 스크롤을 맨 밑으로 내림
    useEffect(() => {

        if (isReady) {
            scrollToBottom();
        }
    }, [isReady]);

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
    scrollToBottom: PropTypes.func.isRequired,
}

export default MessageElement;
