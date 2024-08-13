import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../css/tip/lifeTip.module.css';
import Footer from '../../jsx/fix/Footer.jsx';
import axiosConfig from "../../config/axiosConfig.js";

const LifeTip = () => {
    const navigate = useNavigate();
    const [searchVisible, setSearchVisible] = useState(false);
    const [tips, setTips] = useState([]);
    const [sortOption, setSortOption] = useState('latest');

    useEffect(() => {
        fetchTips();
    }, [sortOption]);

    const fetchTips = async () => {
        try {
            const response = await axiosConfig.get('/api/tips');
            const lifeTips = response.data.filter(tip => tip.tipCategory === 'LIFEHACKS');

            // 정렬 옵션에 따라 게시글 정렬
            if (sortOption === 'latest') {
                lifeTips.sort((a, b) => new Date(b.tipCreatedDate) - new Date(a.tipCreatedDate));
            } else if (sortOption === 'popular') {
                lifeTips.sort((a, b) => b.tipViews - a.tipViews);
            }

            setTips(lifeTips);
        } catch (error) {
            console.error('팁을 불러오는 중 오류가 발생했습니다:', error);
        }
    };

    const toggleSearchBar = () => {
        setSearchVisible(!searchVisible);
    };

    const handleSortChange = (e) => {
        setSortOption(e.target.value);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getFullYear().toString().substr(-2)}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <img className={styles.back} src="/lib/back.svg" alt="back" onClick={() => navigate('/tip')} />
                <h2>생활 Tip</h2>
                <img className={styles.searchIcon}
                     src="/lib/검색.svg"
                     alt="search"
                     id="search-icon"
                     onClick={toggleSearchBar}
                />
            </div>
            <div className={`${styles.searchBar} ${searchVisible ? styles.visible : ''}`} id="search-bar">
                <input type="text" placeholder="검색어를 입력하세요" id="search-input" />
                <img src="/lib/검색.svg" alt="search" />
            </div>

            <div className={styles.postContainer}>
                <div className={styles.sortOptions}>
                    <select value={sortOption} onChange={handleSortChange}>
                        <option value="latest">최신순</option>
                        <option value="popular">인기순</option>
                    </select>
                </div>
                <div className={styles.postList}>
                    {tips.map((tip) => (
                        <div key={tip.tipId} className={styles.postItem} onClick={() => navigate(`/tip/lifehacks/detail/${tip.tipId}`)}>
                            <div className={styles.postContent}>{tip.tipTitle}</div>
                            <div className={styles.postInfo}>
                                <span>{formatDate(tip.tipCreatedDate)}</span>
                                <span>조회수: {tip.tipViews}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className={styles.createButton} onClick={() => navigate('/tip/lifehacks/post')}>
                    <img src="/lib/연필.svg" alt="write" />
                    <span>작성</span>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default LifeTip;