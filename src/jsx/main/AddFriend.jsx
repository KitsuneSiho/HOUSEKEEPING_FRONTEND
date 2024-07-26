import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../fix/Footer.jsx';
import styles from '../../css/main/addFriend.module.css';

const AddFriend = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchVisible, setIsSearchVisible] = useState(false);
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

    const filteredFriends = friends.filter(friend => friend.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <img
                    src="/lib/back.svg"
                    alt="back"
                    onClick={() => navigate('/mainPage')}
                />
                <h2>친구 추가</h2>
                <img
                    src="/lib/검색.svg"
                    alt="search"
                    className={styles.searchIcon}
                    onClick={() => setIsSearchVisible(!isSearchVisible)}
                />
            </div>

            <div className={`${styles.searchBar} ${isSearchVisible ? styles.visible : ''}`}>
                <input
                    type="text"
                    placeholder="닉네임 검색"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <img src="/lib/검색.svg" alt="search" />
            </div>

            {searchQuery && (
                <div className={styles.searchResults}>
                    {filteredFriends.map((friend, index) => (
                        <div key={index} className={styles.searchResultItem}>
                            <img src={friend.img} alt={friend.name} />
                            <span>{friend.name}</span>
                            <button>팔로우</button>
                        </div>
                    ))}
                </div>
            )}

            <Footer />
        </div>
    );
};

export default AddFriend;
