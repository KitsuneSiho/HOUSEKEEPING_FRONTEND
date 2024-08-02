import {useSocket} from "../../components/context/SocketContext.jsx";
import {useEffect, useState} from "react";
import styles from "../../css/chat/chatAlarm.module.css";

// 친구가 채팅을 보냈을 때 알람
const ChatAlarm = () => {

    const {friendMessage, setFriendMessage, friendMessageSender, setFriendMessageSender, nickname} = useSocket();
    const [showChat, setShowChat] = useState(false);
    const [message, setMessage] = useState("");
    const [sender, setSender] = useState("");

    // 채팅 수신 시 실행
    useEffect(() => {

        if (friendMessage !== "" && friendMessageSender !== "" && friendMessageSender !== nickname) {

            setMessage(friendMessage);
            setSender(friendMessageSender);

            setFriendMessage("");
            setFriendMessageSender("");

            setShowChat(true);

            setTimeout(() => setShowChat(false), 3000);
        }

    }, [friendMessage, friendMessageSender]);

    return (
        showChat && <div className={styles.chatAlarm}>
            <div>
                {sender}
            </div>
            <div>
                {message}
            </div>
        </div>
    )
}

export default ChatAlarm;