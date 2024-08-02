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

    const handleSearch = async () => {
        if (searchQuery.trim() !== '') {
            try {
                const response = await axios.get(`${BACK_URL}/friend/search`, {
                    params: {
                        nickname: searchQuery
                    }
                });
                setSearchResults(response.data);
            } catch (error) {
                console.error("친구 검색 중 오류가 발생했습니다:", error);
            }
        } else {
            setSearchResults([]);
        }
    };

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
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        handleSearch(); // 검색어 변경 시 API 호출
                    }}
                />
                <img src="/lib/검색.svg" alt="search" onClick={handleSearch} />
            </div>

            {searchQuery && (
                <div className={styles.searchResults}>
                    {searchResults.map((friend, index) => (
                        <div key={index} className={styles.searchResultItem}>
                            <img src={friend.img || '/lib/마이페이지아이콘.svg'} alt={friend.nickname} />
                            <span>{friend.nickname}</span>
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
