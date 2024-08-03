import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../css/clothes/closetRoom.module.css';
import Footer from '../../jsx/fix/Footer.jsx';

const ClosetRoom = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>Dress Room</h2>
            </div>
            <div className={styles.closetRoomHeader}>
                <h3 onClick={() => navigate('/closet/register')}>
                    등록하기
                    <img src="/lib/카메라.svg" alt="카메라 아이콘" />
                </h3>
                <h3 onClick={() => navigate('/closet/recommend')}>
                    추천받기
                    <img src="/lib/따봉.svg" alt="따봉 아이콘" />
                </h3>
            </div>

            <div className={styles.categories}>
                <div className={styles.category}>
                    <h4>Top</h4>
                    <div className={styles.itemsGrid} onClick={() => navigate('/closet/list')}>
                        <img src="/lib/상의1.svg" alt="Top Item 1" />
                        <img src="/lib/상의1.svg" alt="Top Item 2" />
                        <img src="/lib/상의1.svg" alt="Top Item 3" />
                        <img src="/lib/상의1.svg" alt="Top Item 4" />
                    </div>
                </div>
                <div className={styles.category}>
                    <h4>Bottom</h4>
                    <div className={styles.itemsGrid}>
                        <img src="/lib/하의1.svg" alt="Bottom Item 1" />
                        <img src="/lib/하의1.svg" alt="Bottom Item 2" />
                        <img src="/lib/하의1.svg" alt="Bottom Item 3" />
                        <img src="/lib/하의1.svg" alt="Bottom Item 4" />
                    </div>
                </div>
            </div>

            <div className={styles.categories}>
                <div className={styles.category}>
                    <h4>Shoes</h4>
                    <div className={styles.itemsGrid}>
                        <img src="/lib/신발1.svg" alt="Shoes Item 1" />
                        <img src="/lib/신발1.svg" alt="Shoes Item 2" />
                        <img src="/lib/신발1.svg" alt="Shoes Item 3" />
                        <img src="/lib/신발1.svg" alt="Shoes Item 4" />
                    </div>
                </div>
                <div className={styles.category}>
                    <h4>Accessory</h4>
                    <div className={styles.itemsGrid}>
                        <img src="/lib/악세사리1.svg" alt="Accessory Item 1" />
                        <img src="/lib/악세사리1.svg" alt="Accessory Item 2" />
                        <img src="/lib/악세사리1.svg" alt="Accessory Item 3" />
                        <img src="/lib/악세사리1.svg" alt="Accessory Item 4" />
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ClosetRoom;
