import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../css/chat/chatList.module.css';
import Footer from '../../jsx/fix/Footer.jsx';

const ChatList = () => {
    const navigate = useNavigate();
    const chats = [
        { name: '문재영', message: '안녕하세요', time: '7월18일' },
        { name: '이호준', message: '안녕하세요', time: '7월15일' },
        { name: '강보현', message: '안녕하세요', time: '7월15일' },
        { name: '강현욱', message: '안녕하세요', time: '7월15일' },
        { name: '김상우', message: '안녕하세요', time: '7월15일' },
        { name: '최시호', message: '안녕하세요', time: '7월15일' },
        { name: '엄지훈', message: '안녕하세요', time: '7월15일' },
    ];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <img
                    src="/lib/back.svg"
                    alt="back"
                    onClick={() => navigate('/mainPage')}
                />
                <h2>채팅</h2>
                <img
                    src="/lib/채팅생성.svg"
                    alt="create-chat"
                    onClick={() => navigate('/createChat')}
                />
            </div>
            <div className={styles.chatList}>
                {chats.map((chat, index) => (
                    <div key={index} className={styles.chatItem}>
                        <img src="/lib/마이페이지아이콘.svg" alt="profile" />
                        <div
                            className={styles.chatInfo}
                            onClick={() => navigate('/chatRoom')}
                        >
                            <div className={styles.chatName}>{chat.name}</div>
                            <div className={styles.chatMessage}>{chat.message}</div>
                        </div>
                        <div className={styles.chatTime}>
                            <span>{chat.time}</span>
                        </div>
                    </div>
                ))}
            </div>
            <Footer/>
        </div>
    );
};

export default ChatList;
