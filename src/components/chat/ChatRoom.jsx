import { useNavigate, useParams } from 'react-router-dom';
import { BACK_URL } from "../../Constraints.js";
import styles from '../../css/chat/chatRoom.module.css';
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import MessageElement from "./elements/MessageElement.jsx";
import { useSocket } from "../context/SocketContext.jsx";

const ChatRoom = () => {
    const {
        sendMessageUsingSocket,
        receivedMessage,
        setReceivedMessage,
        messageSender,
        setMessageSender,
        nickname,
        joinRoom,
        isConnected
    } = useSocket();
    const { chatRoomId, chatRoomName } = useParams();
    const [userId, setUserId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [isReady, setIsReady] = useState(false);
    const [input, setInput] = useState("");
    const [messageDates, setMessageDates] = useState({});
    const navigate = useNavigate();
    const messageContainerRef = useRef(null); // 메시지 컨테이너 참조
    const scrollTimeoutRef = useRef(null); // 스크롤 타임아웃 참조

    // 마운트 시 세션에서 유저 아이디를 받아옴
    useEffect(() => {
        setUserId(sessionStorage.getItem("userId"));
    }, []);

    useEffect(() => {
        if (isConnected) {
            joinRoom(chatRoomId);
        }
    }, [isConnected]);

    // 채팅 리스트를 받고 페이지를 준비 상태로 업데이트
    useEffect(() => {
        if (userId !== null) {
            getMessages().then(readAll).then(() => setIsReady(true));
        }
    }, [userId]);

    // 스크롤 이벤트 핸들러
    const handleScroll = () => {
        if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
        }

        messageContainerRef.current.classList.add(styles.scrolling);

        scrollTimeoutRef.current = setTimeout(() => {
            messageContainerRef.current.classList.remove(styles.scrolling);
        }, 600);
    };

    // 채팅을 소켓으로 받을 경우
    useEffect(() => {
        if (receivedMessage !== "" && messageSender !== "" && messageSender !== nickname) {
            const newMessage = {
                messageSenderId: -1,
                messageSenderNickname: messageSender,
                messageContent: receivedMessage,
                messageTimestamp: new Date().toISOString(),
                messageId: Date.now(), // 가상의 고유 ID 생성
            };
            setMessages(prevMessages => [...prevMessages, newMessage]);

            setMessageDates(prevDates => ({
                ...prevDates,
                [newMessage.messageId]: formatDate(newMessage.messageTimestamp)
            }));

            setReceivedMessage("");
            setMessageSender("");

            setTimeout(() => readAll(), [300]);
        }
    }, [receivedMessage, messageSender]);

    // 채팅 리스트를 받아오는 함수
    const getMessages = async () => {
        try {
            const response = await axios.get(`${BACK_URL}/chat/message/list?chatRoomId=${chatRoomId}`);
            setMessages(response.data);

            const dates = {};
            response.data.forEach((message) => {
                const formattedDate = formatDate(message.messageTimestamp);
                dates[message.messageId] = formattedDate;
            });
            setMessageDates(dates);

        } catch (error) {
            console.error('Error getting RoomList: ', error);
        }
    };

    // 메시지 컨테이너를 맨 아래로 스크롤하는 함수
    const scrollToBottom = () => {
        if (messageContainerRef.current) {
            messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
        }
    };

    // 메시지 전송
    const sendMessage = async () => {
        const timestamp = new Date().toISOString();

        try {
            await axios.post(`${BACK_URL}/chat/message/send`, {
                "chatRoomId": chatRoomId,
                "messageSenderId": userId,
                "messageContent": input,
            });
            setInput("");

            sendMessageUsingSocket(input);

            const newMessage = {
                messageSenderId: userId,
                messageSenderNickname: nickname,
                messageContent: input,
                messageTimestamp: timestamp,
                messageId: Date.now(), // 가상의 고유 ID 생성
            };
            setMessages(prevMessages => [...prevMessages, newMessage]);

            setMessageDates(prevDates => ({
                ...prevDates,
                [newMessage.messageId]: formatDate(newMessage.messageTimestamp)
            }));

        } catch (error) {
            console.error('Error getting RoomList: ', error);
        }
    };

    const readAll = async () => {
        try {
            await axios.put(`${BACK_URL}/chat/message/read/all?roomId=${chatRoomId}&userId=${userId}`, {});
        } catch (error) {
            console.error('Error reading messages: ', error);
        }
    };

    const formatDate = (timestamp) => {
        const dateTime = new Date(timestamp);
        return `${dateTime.getFullYear()}.${dateTime.getMonth() + 1}.${dateTime.getDate()}`;
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <img
                    src="/lib/back.svg"
                    alt="back"
                    onClick={() => navigate('/chat')}
                />
                <h2>{chatRoomName}</h2>
            </div>
            <div className={styles.chatRoom}>
                <div className={styles.messageContainer} ref={messageContainerRef} onScroll={handleScroll}>
                    {isReady && messages.map((message, index) => {
                        const formattedDate = messageDates[message.messageId];
                        const showDate = index === 0 || formattedDate !== messageDates[messages[index - 1].messageId];
                        return (
                            <div key={index}>
                                {showDate && <div className={styles.chatDate}>{formattedDate}</div>}
                                <MessageElement message={message} userId={userId} scrollToBottom={scrollToBottom}/>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className={styles.inputContainer}>
                <input type="text" onChange={(e) => setInput(e.target.value)} value={input}
                       placeholder="메시지를 입력하세요..."/>
                <button><img src="/lib/채팅보내기.svg" onClick={sendMessage} alt="send"/></button>
            </div>
        </div>
    );
};

export default ChatRoom;
