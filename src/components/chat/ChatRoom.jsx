import { useNavigate, useParams } from 'react-router-dom';
import { BACK_URL } from "../../Constraints.js";
import styles from '../../css/chat/chatRoom.module.css';
import { useEffect, useState } from "react";
import axios from "axios";
import MessageElement from "./elements/MessageElement.jsx";

const ChatRoom = () => {
    const { chatRoomId } = useParams();
    const [userId, setUserId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [isReady, setIsReady] = useState(false);
    const [input, setInput] = useState("");
    const [messageDates, setMessageDates] = useState({});
    const navigate = useNavigate();

    // 마운트 시 세션에서 유저 아이디를 받아옴
    useEffect(() => {
        setUserId(sessionStorage.getItem("userId"));
    }, []);

    // 채팅 리스트를 받고 페이지를 준비 상태로 업데이트
    useEffect(() => {
        if (userId !== null) {
            getMessages().then(readAll).then(() => setIsReady(true));
        }
    }, [userId]);

    // 채팅 리스트를 받아오는 함수
    const getMessages = async () => {
        try {
            const response = await axios.get(`${BACK_URL}/chat/message/list?chatRoomId=${chatRoomId}`)
            setMessages(response.data);
            console.log(response.data);

            const dates = {};
            response.data.forEach((message) => {
                const formattedDate = formatDate(message.messageTimestamp);
                dates[message.messageId] = formattedDate;
            });
            setMessageDates(dates);

        } catch (error) {
            console.error('Error getting RoomList: ', error);
        }
    }

    const sendMessage = async () => {
        try {
            await axios.post(`${BACK_URL}/chat/message/send`, {
                "chatRoomId": chatRoomId,
                "messageSenderId": userId,
                "messageContent": input,
            });
            setInput("");
        } catch (error) {
            console.error('Error getting RoomList: ', error);
        }
    }

    const readAll = async () => {
        try {
            axios.put(`${BACK_URL}/chat/message/read/all?roomId=${chatRoomId}&userId=${userId}`, {});
        } catch (error) {
            console.error('Error reading messages: ', error);
        }
    }

    const formatDate = (timestamp) => {
        const dateTime = new Date(timestamp);
        return `${dateTime.getFullYear()}.${dateTime.getMonth() + 1}.${dateTime.getDate()}`;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <img
                    src="/lib/back.svg"
                    alt="back"
                    onClick={() => navigate('/chat')}
                />
                <h2>채팅방</h2>
            </div>
            <div className={styles.chatRoom}>
                <div className={styles.messageContainer}>
                    {isReady && messages.map((message, index) => {
                        const formattedDate = messageDates[message.messageId];
                        const showDate = index === 0 || formattedDate !== messageDates[messages[index - 1].messageId];
                        return (
                            <div key={index}>
                                {showDate && <div className={styles.chatDate}>{formattedDate}</div>}
                                <MessageElement message={message} userId={userId} />
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className={styles.inputContainer}>
                <input type="text" onChange={(e) => setInput(e.target.value)} value={input}
                       placeholder="메시지를 입력하세요..." />
                <button><img src="/lib/채팅보내기.svg" onClick={sendMessage} alt="send" /></button>
            </div>
        </div>
    );
};

export default ChatRoom;