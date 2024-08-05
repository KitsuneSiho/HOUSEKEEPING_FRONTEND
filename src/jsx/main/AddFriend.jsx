import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from '../fix/Footer.jsx';
import styles from '../../css/main/addFriend.module.css';
import { BACK_URL } from "../../Constraints.js";

const AddFriend = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const navigate = useNavigate();
    const loginUserId = 3; // 실제 userId를 적절히 설정해야 합니다.

    const handleSearch = async () => {
        if (searchQuery.trim() !== '') {
            try {
                // 사용자 검색
                const response = await axios.get(`${BACK_URL}/friend/search`, {
                    params: {
                        nickname: searchQuery
                    }
                });

                // 검색 결과에서 자기 자신을 제외
                const filteredResults = response.data.filter(user => user.userId !== loginUserId);

                // 사용자 ID 목록을 쉼표로 구분된 문자열로 변환
                const userIds = filteredResults.map(user => user.userId).join(',');
                const requestStatusResponse = await axios.get(`${BACK_URL}/friendRequest/status`, {
                    params: {
                        senderId: loginUserId,
                        receiverIds: userIds
                    }
                });

                const requestStatusMap = requestStatusResponse.data;
                const updatedResults = filteredResults.map(user => ({
                    ...user,
                    requestStatus: requestStatusMap[user.userId] || null
                }));

                setSearchResults(updatedResults);
            } catch (error) {
                console.error("친구 검색 중 오류가 발생했습니다:", error);
            }
        } else {
            setSearchResults([]);
        }
    };

    // 친구 요청 보내기
    const sendFriendRequest = async (receiverId) => {
        try {
            const requestDTO = {
                requestSenderId: loginUserId,
                requestReceiverId: receiverId,
                requestStatus: "PENDING",
                requestDate: new Date().toISOString()
            };

            const response = await axios.post(`${BACK_URL}/friendRequest/send`, requestDTO, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log('Response from server:', response); // 서버 응답 로그
            alert('팔로우 요청을 보냈습니다.');
            handleSearch(); // 상태 갱신을 위해 다시 검색
        } catch (error) {
            console.error('Error sending friend request:', error); // 오류 로그
        }
    };

    // 팔로우 취소
    const cancelFriendRequest = async (receiverId) => {
        try {
            const response = await axios.post(`${BACK_URL}/friendRequest/cancel`, null, {
                params: {
                    senderId: loginUserId,  // 올바르게 설정된 senderId
                    receiverId: receiverId  // 올바르게 설정된 receiverId
                }
            });
            alert('팔로우를 취소했습니다.');
            handleSearch(); // 상태 갱신을 위해 다시 검색
        } catch (error) {
            console.error('Error cancelling friend request:', error);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <img className={styles.back}
                     src="/lib/back.svg"
                     alt="back"
                     onClick={() => navigate('/main')}
                />
                <h2>친구 추가</h2>
                <img
                    src="/lib/검색.svg"
                    alt="search"
                    className={styles.searchIcon}
                    onClick={() => setIsSearchVisible(!isSearchVisible)}
                />
            </div>

            <div className={`${styles.searchBar} ${isSearchVisible ? styles.visible : ''}`} id="search-bar">
                <input
                    type="text"
                    placeholder="닉네임 검색"
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        handleSearch(); // 검색어 변경 시 API 호출
                    }}
                />
                <img src="/lib/검색.svg" alt="search" onClick={handleSearch}/>
            </div>

            {searchQuery && (
                <div className={styles.searchResults}>
                    {searchResults.map((friend, index) => (
                        <div key={index} className={styles.searchResultItem}>
                            <img src={friend.img || '/lib/마이페이지아이콘.svg'} alt={friend.nickname}/>
                            <span>{friend.nickname}</span>
                            {friend.requestStatus === "PENDING" ? (
                                <button>승인 대기중</button>
                            ) : friend.requestStatus === "ACCEPTED" ? (
                                <button onClick={() => cancelFriendRequest(friend.userId)}>팔로우 취소</button>
                            ) : (
                                <button onClick={() => sendFriendRequest(friend.userId)}>팔로우</button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <Footer/>
        </div>
    );
};

export default AddFriend;
