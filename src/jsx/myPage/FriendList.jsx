import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../css/myPage/friendList.module.css';
import Footer from '../../jsx/fix/Footer.jsx';
import axios from "axios";
import { BACK_URL } from "../../Constraints.js";
import {useLogin} from "../../contexts/AuthContext.jsx";
import axiosInstance from "../../config/axiosInstance.js";

const FriendList = () => {

    const {user} = useLogin();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [friends, setFriends] = useState([]);

    // 친구 목록 가져오기
    const fetchFriends = async () => {
        try {
            const response = await axiosInstance.get(`/friend/list`, {
                params: { userId: user.userId }
            });
            setFriends(response.data);
            console.log(response.data);
        } catch (error) {
            console.error('Error fetching friends:', error);
        }
    };

    // 초기 페이지 로드 시
    useEffect(() => {
        fetchFriends();
    }, []);

    const filteredFriends = friends.filter(friend =>
        friend.nickname.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // 팔로우 취소
    const cancelFriendRequest = async (receiverId) => {
        console.log(user.userId);
        console.log(receiverId);

        try {
            const response = await axiosInstance.post(`/friendRequest/cancel`, null, {
                params: {
                    senderId: user.userId,
                    receiverId: receiverId
                }
            });
            alert('팔로우를 취소했습니다.');
            fetchFriends(); // 상태 갱신을 위해 친구 목록 다시 불러오기
        } catch (error) {
            console.error('Error cancelling friend request:', error);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <img
                    className={styles.back}
                    src="/lib/back.svg"
                    alt="back"
                    onClick={() => navigate('/myPage')}
                />
                <h2>친구 관리</h2>
                <img
                    className={styles.searchIcon}
                    src="/lib/검색.svg"
                    alt="search"
                    id="search-icon"
                    onClick={() => {
                        const searchBar = document.getElementById('search-bar');
                        if (searchBar.classList.contains(styles.visible)) {
                            searchBar.classList.remove(styles.visible);
                        } else {
                            searchBar.classList.add(styles.visible);
                        }
                    }}
                />
            </div>

            <div className={`${styles.searchBar} ${styles.visible}`} id="search-bar">
                <input
                    type="text"
                    placeholder="닉네임 검색"
                    id="search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className={styles.searchResults} id="search-results">
                {filteredFriends.map(friend => (
                    <div key={friend.userId} className={styles.searchResultItem}>
                        {/* 이미지 필드가 없으므로 제거 */}
                        <img src={friend.img || '/lib/마이페이지아이콘.svg'} alt={friend.nickname}/>
                        <span>{friend.nickname}</span>
                        <button onClick={() => cancelFriendRequest(friend.userId)}>팔로우 취소</button>
                    </div>
                ))}
            </div>

            <Footer/>
        </div>
    );
};

export default FriendList;
