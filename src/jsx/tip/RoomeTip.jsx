import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../css/tip/roomeTip.module.css';
import Footer from '../../jsx/fix/Footer.jsx';

const RoomeTip = () => {
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const navigate = useNavigate();

    const toggleSearchBar = () => {
        setIsSearchVisible(!isSearchVisible);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <img className={styles.back} src="public/lib/back.svg" alt="back" onClick={() => navigate('/tip')} />
                <h2>루미`s Tip</h2>
                <img src="public/lib/검색.svg" alt="search" className={styles.searchIcon} onClick={toggleSearchBar} />
            </div>

            <div className={`${styles.searchBar} ${isSearchVisible ? styles.visible : ''}`} id={styles.searchBar}>
                <input type="text" placeholder="검색어를 입력하세요" id={styles.searchInput} />
                <img src="public/lib/검색.svg" alt="search" />
            </div>

            <div className={styles.postContainer}>
                <div className={styles.sortOptions}>
                    <select>
                        <option value="latest">최신순</option>
                        <option value="popular">인기순</option>
                    </select>
                </div>

                <div className={styles.postList}>
                    <div className={styles.postItem}>
                        <div className={styles.postContent} onClick={() => navigate('/roomeTipDetail')}>
                            바나나껍질은 어디 버리게요~ ~??
                        </div>
                        <div className={styles.postInfo}>
                            <span>24.07.18</span>
                            <span>루미</span>
                        </div>
                    </div>
                    {/* Additional post items can be added here */}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default RoomeTip;
