import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../css/myPage/friendRequest.module.css';
import Footer from '../../jsx/fix/Footer.jsx';

const FriendRequest = () => {
    const navigate = useNavigate();
    const friends = [
        { name: '문재영', img: '/lib/마이페이지아이콘.svg' },
        { name: '강현욱', img: '/lib/마이페이지아이콘.svg' },
        { name: '이호준', img: '/lib/마이페이지아이콘.svg' },
        { name: '김상우', img: '/lib/마이페이지아이콘.svg' },
        { name: '최시호', img: '/lib/마이페이지아이콘.svg' },
        { name: '엄지훈', img: '/lib/마이페이지아이콘.svg' },
        { name: '강보현', img: '/lib/마이페이지아이콘.svg' },
    ];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <img className={styles.back}
                     src="/lib/back.svg"
                     alt="back"
                     onClick={() => navigate('/myPage')}
                />
                <h2>친구 요청</h2>
            </div>

            <div className={styles.searchResults}>
                {friends.map((friend, index) => (
                    <div key={index} className={styles.searchResultItem}>
                        <img src={friend.img} alt={friend.name} />
                        <span>{friend.name}</span>
                        <button>팔로우 승인</button>
                    </div>
                ))}
            </div>

            <Footer />
        </div>
    );
};

export default FriendRequest;
