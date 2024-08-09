import {useParams} from 'react-router-dom';
import {BACK_URL} from "../../Constraints.js";
import styles from '../../css/chat/chatRoom.module.css';
import {useEffect, useState, useRef} from "react";
import axios from "axios";
import Message from "../../components/chat/Message.jsx";
import {useSocket} from "../../contexts/SocketContext.jsx";
import ChatRoomHeader from "../../components/chat/ChatRoomHeader.jsx";

const ChatRoomPage = () => {
    const {
        sendMessageUsingSocket,
        receivedMessage,
        setReceivedMessage,
        messageSender,
        setMessageSender,
        announceMessage,
        setAnnounceMessage,
        nickname,
        joinRoom,
        isConnected
    } = useSocket();
    const {chatRoomId} = useParams();
    const [chatRoomType, setChatRoomType] = useState("");
    const [chatRoomName, setChatRoomName] = useState("");
    const [userId, setUserId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [isReady, setIsReady] = useState(false);
    const [input, setInput] = useState("");
    const [messageDates, setMessageDates] = useState({});
    const [chatRoomMembers, setChatRoomMembers] = useState([]);
    const messageContainerRef = useRef(null); // 메시지 컨테이너 참조
    const scrollTimeoutRef = useRef(null); // 스크롤 타임아웃 참조

    // 마운트 시 세션에서 유저 아이디를 받아옴
    useEffect(() => {
        setUserId(sessionStorage.getItem("userId"));
        getChatRoomInfo().then(getChatRoomMembers);
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

    //채팅 방 정보를 받아옴
    const getChatRoomInfo = async () => {

        try {

            const response = await axios.get(BACK_URL + `/chat/room/${chatRoomId}`);

            setChatRoomName(response.data.chatRoomName);
            setChatRoomType(response.data.chatRoomType);
        } catch (error) {
            console.error("failed to get chatRoom Info:", error);
        }
    }

    // 채팅 방 멤버를 받아옴
    const getChatRoomMembers = async () => {

        try {

            const result = await axios.get(BACK_URL + `/chat/room/member/list?chatRoomId=${chatRoomId}&userId=${sessionStorage.getItem("userId")}`);

            setChatRoomMembers(result.data);
        } catch (error) {
            console.error("error getting room members:", error);
        }
    }

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

            setTimeout(() => readAll(), 300);
        }
    }, [receivedMessage, messageSender]);

    // 공지를 소켓으로 받은 경우
    useEffect(() => {
        if (announceMessage !== "") {
            const newAnnounce = {
                messageSenderId: 0,
                messageContent: announceMessage,
                messageTimestamp: new Date().toISOString(),
                messageId: Date.now(), // 가상의 고유 ID 생성
            };
            setMessages(prevMessages => [...prevMessages, newAnnounce]);

            setMessageDates(prevDates => ({
                ...prevDates,
                [newAnnounce.messageId]: formatDate(newAnnounce.messageTimestamp)
            }));

            setAnnounceMessage("");
            getChatRoomInfo();

            setTimeout(() => readAll(), 300);
        }
    }, [announceMessage]);

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
            await axios.put(`${BACK_URL}/chat/message/read/all?roomId=${chatRoomId}&userId=${sessionStorage.getItem("userId")}`, {});
        } catch (error) {
            console.error('Error reading messages: ', error);
        }
    };

    const formatDate = (timestamp) => {
        const dateTime = new Date(timestamp);
        return `${dateTime.getFullYear()}.${dateTime.getMonth() + 1}.${dateTime.getDate()}`;
    };

    // 엔터 입력 이벤트 핸들러
    const enterPressHandler = (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    }

    return (
        <div className={styles.container}>
            { chatRoomType !== "" && chatRoomName !== "" && <>
                <ChatRoomHeader chatRoomType={chatRoomType} chatRoomName={chatRoomType === "SINGLE" ? chatRoomMembers[0] : chatRoomName} userId={userId}/>
                <div className={styles.chatRoom}>
                    <div className={styles.messageContainer} ref={messageContainerRef} onScroll={handleScroll}>
                        {isReady && messages.map((message, index) => {
                            const formattedDate = messageDates[message.messageId];
                            const showDate = index === 0 || formattedDate !== messageDates[messages[index - 1].messageId];
                            return (
                                <div key={index}>
                                    {showDate && <div className={styles.chatDate}>{formattedDate}</div>}
                                    <Message message={message} userId={userId} scrollToBottom={scrollToBottom}/>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className={styles.inputContainer}>
                    <input type="text" onChange={(e) => setInput(e.target.value)} value={input}
                           placeholder="메시지를 입력하세요..." onKeyPress={(e) => enterPressHandler(e)} />
                    <button><img src="/lib/채팅보내기.svg" onClick={sendMessage} alt="send" /></button>
                </div>
            </>
            }
        </div>
    );
};

export default ChatRoomPage;
