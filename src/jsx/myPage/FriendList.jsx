import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../css/myPage/friendList.module.css';
import Footer from '../../jsx/fix/Footer.jsx';

const FriendList = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [friends] = useState([
        { name: '문재영', img: 'public/lib/마이페이지아이콘.svg' },
        { name: '강현욱', img: 'public/lib/마이페이지아이콘.svg' },
        { name: '이호준', img: 'public/lib/마이페이지아이콘.svg' },
        { name: '김상우', img: 'public/lib/마이페이지아이콘.svg' },
        { name: '최시호', img: 'public/lib/마이페이지아이콘.svg' },
        { name: '엄지훈', img: 'public/lib/마이페이지아이콘.svg' },
        { name: '강보현', img: 'public/lib/마이페이지아이콘.svg' },
    ]);

    const filteredFriends = friends.filter(friend =>
        friend.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <img src="public/lib/back.svg" alt="back" onClick={() => navigate('/myPage')} />
                <h2>친구 관리</h2>
                <img src="public/lib/검색.svg" alt="search" id="search-icon" onClick={() => {
                    const searchBar = document.getElementById('search-bar');
                    if (searchBar.classList.contains(styles.visible)) {
                        searchBar.classList.remove(styles.visible);
                    } else {
                        searchBar.classList.add(styles.visible);
                    }
                }} />
            </div>

            <div className={`${styles.searchBar} ${styles.visible}`} id="search-bar">
                <input
                    type="text"
                    placeholder="닉네임 검색"
                    id="search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <img src="public/lib/검색.svg" alt="search" />
            </div>

            <div className={styles.searchResults} id="search-results">
                {filteredFriends.map(friend => (
                    <div key={friend.name} className={styles.searchResultItem}>
                        <img src={friend.img} alt={friend.name} />
                        <span>{friend.name}</span>
                        <button>팔로우 취소</button>
                    </div>
                ))}
            </div>

            <Footer />
        </div>
    );
};

export default FriendList;
