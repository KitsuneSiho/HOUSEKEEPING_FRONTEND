import {createContext, useContext, useEffect, useRef, useState} from "react";
import PropTypes from "prop-types";
import {io} from "socket.io-client";
import axios from "axios";
import {BACK_URL} from "../../Constraints.js";

const SocketContext = createContext();

export const SocketProvider = ({children}) => {

    const socketRef = useRef(null);
    const [receivedMessage, setReceivedMessage] = useState("");
    const [messageSender, setMessageSender] = useState("");
    const [room, setRoom] = useState("");
    const [nickname, setNickname] = useState("");
    const [isConnected, setIsConnected] = useState(false);
    const [onlineFriends, setOnlineFriends] = useState([]);

    useEffect(() => {
        const socket = io('http://localhost:3000', {
            reconnection: true,
            reconnectionAttempts: 10,      // 재연결 시도 횟수
            reconnectionDelay: 1000,       // 처음 재연결 시도 전 대기 시간 (밀리초)
            reconnectionDelayMax: 5000,    // 최대 재연결 대기 시간 (밀리초)
            randomizationFactor: 0.5       // 재연결 시도 간 대기 시간의 무작위 요소
        });

        socketRef.current = socket;

        socket.on('connect', () => {

            const sessionNickname = sessionStorage.getItem("nickname");

            setIsConnected(true);
            console.log(`Socket connected: ${socket.id}, ${nickname}`);

            if (sessionNickname) {
                socketLogin(sessionNickname);
                setNickname(sessionNickname);
            }
        });

        socket.on('receive_message', (data) => {

            console.log("data:", data);

            const { nickname, message } = data;
            setMessageSender(nickname);
            setReceivedMessage(message);
        });

        socket.on('friend_login', (data) => {

            console.log('friend login:', data);
        });

        socket.on('message_alarm', (data) => {

            console.log('message alarm:', data);
        });

        socket.on('friend_logout', (data) => {

            console.log('friend logout:', data);
        });

        socket.on('disconnect', () => {

            setIsConnected(false);
            console.log('Socket disconnected');
        });

        return () => {
            socket.off('connect');
            socket.off('receive_message');
            socket.off('disconnect');
        };
    }, []);

    const socketLogin = (nickname) => {

        setNickname(nickname);
        socketRef.current.emit('login', nickname);
        console.log("login: ", nickname);
    }

    const joinRoom = (data) => {
        setRoom(data);
        socketRef.current.emit('join_room', data);
        console.log("joinRoom: ", data);
    };

    const leaveRoom = () => {
        socketRef.current.emit('leave_room', room);
        setRoom('');
    };

    const sendMessageUsingSocket = (message) => {
        if (room) {
            socketRef.current.emit('send_message', {room, nickname, message});
        } else {
            alert('Please join a room first.');
        }
    };

    const setOnline = async (userId, isOnline) => {

        try {

            await axios.put(BACK_URL + `/user/status/update?userId=${userId}&isOnline=${isOnline}`, {});

        } catch (error) {
            console.error("error setting online:", error);
        }
    }

    const getOnlineFriends = async (userId) => {

        try {

            const response = await axios.get(BACK_URL + `/friend/list/online?userId=${userId}`);

            setOnlineFriends(response.data);
            console.log(response.data);

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
            socketLogin,
            joinRoom,
            leaveRoom,
            sendMessageUsingSocket,
            setOnline,
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