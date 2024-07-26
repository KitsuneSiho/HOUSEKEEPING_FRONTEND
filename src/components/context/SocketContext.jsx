import {createContext, useContext, useEffect, useRef, useState} from "react";
import PropTypes from "prop-types";
import {io} from "socket.io-client";

const SocketContext = createContext();

export const SocketProvider = ({children}) => {

    const socketRef = useRef(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [room, setRoom] = useState('');

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
            console.log('Socket connected:', socket.id);
        });

        socket.on('receive_message', (data) => {
            setMessages((prevMessages) => [...prevMessages, data]);
        });

        socket.on('disconnect', () => {
            console.log('Socket disconnected');
        });

        return () => {
            socket.off('connect');
            socket.off('receive_message');
            socket.off('disconnect');
        };
    }, []);

    const joinRoom = () => {
        socketRef.current.emit('join_room', room);
        setMessages([]); // Clear messages when joining a new room
    };

    const leaveRoom = () => {
        socketRef.current.emit('leave_room', room);
        setRoom('');
        setMessages([]);
    };

    const sendMessage = () => {
        if (room) {
            socketRef.current.emit('send_message', {room, message});
            setMessages((prevMessages) => [...prevMessages, message]); // 로컬 상태 업데이트
            setMessage('');
        } else {
            alert('Please join a room first.');
        }
    };

    return (
        <SocketContext.Provider value={{message, setMessage, messages, setMessages, room, setRoom, joinRoom, leaveRoom, sendMessage}}>
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