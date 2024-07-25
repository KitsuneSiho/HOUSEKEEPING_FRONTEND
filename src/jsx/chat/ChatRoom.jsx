import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../css/chat/chatRoom.module.css';

const ChatRoom = () => {
    const navigate = useNavigate();
    const messages = [
        { id: 1, type: 'received', text: '잠은 죽어서 자라', time: '오전 10:16' },
        { id: 2, type: 'sent', text: 'ㅇㅇ', time: '오전 10:16' },
    ];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <img
                    src="/lib/back.svg"
                    alt="back"
                    onClick={() => navigate('/chatList')}
                />
                <h2>채팅방</h2>
            </div>
            <div className={styles.chatRoom}>
                <div className={styles.chatDate}>2024.07.18</div>
                <div className={styles.messageContainer}>
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`${styles.message} ${styles[message.type]}`}
                        >
                            <img src="/lib/마이페이지아이콘.svg" alt="profile" />
                            <div className={styles.messageContent}>
                                <p>{message.text}</p>
                            </div>
                            <span className={styles.messageTime}>{message.time}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className={styles.inputContainer}>
                <input type="text" placeholder="메시지를 입력하세요..." />
                <button><img src="/lib/채팅보내기.svg" alt="send" /></button>
            </div>
        </div>
    );
};

export default ChatRoom;
