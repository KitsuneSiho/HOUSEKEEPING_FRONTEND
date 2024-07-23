import React, {useState, useEffect} from 'react';
import {io} from 'socket.io-client';

const ChatPrototype = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [room, setRoom] = useState('');

    const socket = io('http://localhost:3000', {
        reconnection: true,
        reconnectionAttempts: 10,      // 재연결 시도 횟수
        reconnectionDelay: 1000,       // 처음 재연결 시도 전 대기 시간 (밀리초)
        reconnectionDelayMax: 5000,    // 최대 재연결 대기 시간 (밀리초)
        randomizationFactor: 0.5       // 재연결 시도 간 대기 시간의 무작위 요소
    });

    useEffect(() => {
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
        socket.emit('join_room', room);
        setMessages([]); // Clear messages when joining a new room
    };

    const leaveRoom = () => {
        socket.emit('leave_room', room);
        setRoom('');
        setMessages([]);
    };

    const sendMessage = () => {
        if (room) {
            socket.emit('send_message', {room, message});
            setMessages((prevMessages) => [...prevMessages, message]); // 로컬 상태 업데이트
            setMessage('');
        } else {
            alert('Please join a room first.');
        }
    };

    return (
        <div>
            <h1>Socket.IO Chat</h1>
            <input
                type="text"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                placeholder="Enter room name"
            />
            <button onClick={joinRoom}>Join Room</button>
            <button onClick={leaveRoom}>Leave Room</button>
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>{msg}</div>
                ))}
            </div>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message"
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default ChatPrototype;
