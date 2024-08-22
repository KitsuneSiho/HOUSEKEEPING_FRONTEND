import {createContext, useContext, useEffect, useRef, useState} from "react";
import PropTypes from "prop-types";
import {io} from "socket.io-client";
import axiosInstance from "../config/axiosInstance.js";
import {jwtDecode} from "jwt-decode";

// Context 생성
const SocketContext = createContext();

// Context Provider
export const SocketProvider = ({children}) => {
    const socketRef = useRef(null);
    const [receivedMessage, setReceivedMessage] = useState("");
    const [messageSender, setMessageSender] = useState("");
    const [friendMessage, setFriendMessage] = useState("");
    const [announceMessage, setAnnounceMessage] = useState("");
    const [friendMessageSender, setFriendMessageSender] = useState("");
    const [room, setRoom] = useState("");
    const [nickname, setNickname] = useState("");
    const [isConnected, setIsConnected] = useState(false);
    const [onlineFriends, setOnlineFriends] = useState([]);

    // 소켓 연결 및 이벤트 핸들러 설정
    useEffect(() => {
        const socket = io('https://socket.bit-two.com', {
            reconnection: true,
            reconnectionAttempts: 10,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            randomizationFactor: 0.5,
            withCredentials: true, // 쿠키를 자동으로 전송
        });

        socketRef.current = socket;

        socket.on('connect', () => {
            const access = localStorage.getItem("access");
            const decode = jwtDecode(access);
            const loginNickname = decode.nickname;

            setIsConnected(true);
            console.log(`Socket connected: ${socket.id}, ${nickname}`);

            if (loginNickname) {
                socketLogin(loginNickname);
                setNickname(loginNickname);
            }
        });

        socket.on('receive_message', (data) => {
            const {nickname, message} = data;
            setMessageSender(nickname);
            setReceivedMessage(message);
        });

        socket.on('friend_message', (data) => {
            const {nickname, message} = data;
            setFriendMessageSender(nickname);
            setFriendMessage(message);
        });

        socket.on('announce_message', (data) => {

            console.log(data);

            const {message} = data;
            setAnnounceMessage(message);
        });

        socket.on('friend_login', (data) => {

            setOnlineFriends(prevFriends => {
                const friendExists = prevFriends.some(nickname => nickname === data.nickname);
                if (!friendExists) {
                    console.log('friend login:', data.nickname);
                    return [...prevFriends, data.nickname];
                }
                return prevFriends;
            });
        });

        socket.on('friend_logout', (data) => {
            console.log('friend logout:', data.nickname);
            setOnlineFriends(prevFriends => prevFriends.filter(friend => friend !== data.nickname));
        });

        socket.on('disconnect', () => {
            setIsConnected(false);
            console.log('Socket disconnected');
        });

        return () => {
            socket.off('connect');
            socket.off('receive_message');
            socket.off('friend_login');
            socket.off('friend_logout');
            socket.off('disconnect');
        };
    }, []);

    const socketLogin = (nickname) => {
        setNickname(nickname);

        const accessToken = localStorage.getItem('access');

        // 로그인 이벤트를 서버로 전송
        socketRef.current.emit('login', {
            nickname: nickname,
            accessToken: accessToken,
        });

        getOnlineFriends(nickname);
        console.log("login: ", nickname);
    }

    const joinRoom = (data) => {
        setRoom(data);
        socketRef.current.emit('join_room', data);
        console.log("joinRoom:", data);
    };

    const leaveRoom = () => {
        socketRef.current.emit('leave_room', room);
        setRoom('');
    };

    const announceRoom = (message) => {

        if (room) {
            socketRef.current.emit('announce', {room, message});
        } else {
            alert('Please join a room first.');
        }
    }

    const sendMessageUsingSocket = (message) => {
        if (room) {
            socketRef.current.emit('send_message', {room, nickname, message});
            socketRef.current.emit('send_message_to_friends', {nickname, message});
        } else {
            alert('Please join a room first.');
        }
    };

    const getOnlineFriends = async (nickname) => {
        try {
            const response = await axiosInstance.get(`/friend/list/online2?nickname=${nickname}`);
            const nicknames = response.data.map(friend => friend.nickname);
            setOnlineFriends(nicknames);
        } catch (error) {
            console.error("error fetching online friends list:", error);
        }
    }

    return (
        <SocketContext.Provider value={{
            receivedMessage,
            setReceivedMessage,
            room,
            setRoom,
            nickname,
            setNickname,
            messageSender,
            setMessageSender,
            isConnected,
            onlineFriends,
            setOnlineFriends,
            friendMessage,
            setFriendMessage,
            friendMessageSender,
            setFriendMessageSender,
            announceMessage,
            setAnnounceMessage,
            socketLogin,
            joinRoom,
            leaveRoom,
            announceRoom,
            sendMessageUsingSocket,
            getOnlineFriends,
        }}>
            {children}
        </SocketContext.Provider>
    );
};

SocketProvider.propTypes = {
    children: PropTypes.node,
}

export const useSocket = () => {
    return useContext(SocketContext);
};
