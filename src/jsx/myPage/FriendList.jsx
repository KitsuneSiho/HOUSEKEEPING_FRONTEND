import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../css/myPage/friendList.module.css';
import Footer from '../../jsx/fix/Footer.jsx';
import axios from "axios";
import { BACK_URL } from "../../Constraints.js";

const FriendList = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [friends, setFriends] = useState([]);


    // 초기 페이지 로드 시 오늘 날짜의 스케줄을 띄움
    useEffect(() => {

        // 친구 목록 가져오기
        const userId = 1;
        axios.get(`${BACK_URL}/friend/list`, {
            params: {
                userId: userId
            }
        })
            .then(response => {
                setFriends(response.data);
                console.log(friends);
            })
            .catch(error => {
                console.error('Error fetching friends:', error);
            });
    }, []);


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
