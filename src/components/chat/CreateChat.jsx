import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../css/chat/createChat.module.css';
import Footer from '../../jsx/fix/Footer.jsx';

const CreateChat = () => {
    const navigate = useNavigate();
    const [selectedFriends, setSelectedFriends] = useState([]);
    const friends = [
        { name: '문재영', img: '/lib/마이페이지아이콘.svg' },
        { name: '이호준', img: '/lib/마이페이지아이콘.svg' },
        { name: '강보현', img: '/lib/마이페이지아이콘.svg' },
        { name: '강현욱', img: '/lib/마이페이지아이콘.svg' },
        { name: '김상우', img: '/lib/마이페이지아이콘.svg' },
        { name: '최시호', img: '/lib/마이페이지아이콘.svg' },
        { name: '엄지훈', img: '/lib/마이페이지아이콘.svg' },
    ];

    const handleCheckboxChange = (name) => {
        setSelectedFriends(prev =>
            prev.includes(name) ? prev.filter(friend => friend !== name) : [...prev, name]
        );
    };

    const handleAddChat = () => {
        navigate('/chatRoom');
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <img
                    src="/lib/back.svg"
                    alt="back"
                    onClick={() => navigate('/chat')}
                />
                <h2>대화 상대 선택</h2>
                <h4 onClick={handleAddChat}>추가</h4>
            </div>
            <div className={styles.friendList}>
                {friends.map((friend, index) => (
                    <div key={index} className={styles.friendItem}>
                        <img src={friend.img} alt="profile" />
                        <div className={styles.friendInfo}>
                            <div className={styles.friendName}>{friend.name}</div>
                        </div>
                        <input
                            type="checkbox"
                            className={styles.friendCheckbox}
                            checked={selectedFriends.includes(friend.name)}
                            onChange={() => handleCheckboxChange(friend.name)}
                        />
                    </div>
                ))}
            </div>
            <Footer/>
        </div>
    );
};

export default CreateChat;
