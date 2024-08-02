import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../css/tip/tip.module.css';
import Footer from '../../jsx/fix/Footer.jsx';

const Tip = () => {
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const navigate = useNavigate();

    const toggleSearchBar = () => {
        setIsSearchVisible(!isSearchVisible);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <img className={styles.back} src="public/lib/back.svg" alt="back" onClick={() => navigate('/mainPage')} />
                <h2>Tip</h2>
                <img src="public/lib/검색.svg" alt="search" className={styles.searchIcon} onClick={toggleSearchBar} />
            </div>

            <div className={`${styles.searchBar} ${isSearchVisible ? styles.visible : ''}`} id={styles.searchBar}>
                <input type="text" placeholder="닉네임 검색" id={styles.searchInput} />
                <img src="public/lib/검색.svg" alt="search" />
            </div>

            <div className={styles.roomeTip}>
                <button type="button" onClick={() => navigate('/roomeTip')}>
                    <p>루미`s Tip</p>
                </button>
            </div>
            <div className={styles.wasteTip}>
                <button type="button" onClick={() => navigate('/wasteTip')}>
                    <p>폐기물 Tip</p>
                </button>
            </div>
            <div className={styles.lifeTip}>
                <button type="button" onClick={() => navigate('/lifeTip')}>
                    <p>생활 Tip</p>
                </button>
            </div>

            <Footer />
        </div>
    );
};

export default Tip;
