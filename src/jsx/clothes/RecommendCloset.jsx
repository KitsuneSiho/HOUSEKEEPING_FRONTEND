import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../css/clothes/recommendCloset.module.css';
import Footer from '../../jsx/fix/Footer.jsx';

const RecommendCloset = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <img src="public/lib/back.svg" alt="back" onClick={() => navigate('/closetRoom')} />
                <h2>Dress Room</h2>
            </div>
            <div className={styles.closetRoomHeader}>
                <h3 onClick={() => navigate('/uploadCloset')}>
                    등록하기
                    <img src="public/lib/카메라.svg" alt="camera icon" />
                </h3>
                <h3 onClick={() => navigate('/recommendCloset')}>
                    추천받기
                    <img src="public/lib/따봉.svg" alt="thumbs up icon" />
                </h3>
            </div>
            <div className={styles.weather}>
                <p>날씨</p>
            </div>
            <div className={styles.selection}>
                <label htmlFor="region">지역 선택:</label>
                <select id="region">
                    <option value="seoul">서울</option>
                    <option value="busan">부산</option>
                    <option value="incheon">인천</option>
                    <option value="gwangju">광주</option>
                </select>
                <label htmlFor="date">날짜 선택:</label>
                <input type="date" id="date" name="date" />
            </div>
            <div className={styles.recommendations}>
                <img src="public/lib/추천옷.svg" alt="추천 옷 1" />
                <img src="public/lib/추천옷.svg" alt="추천 옷 2" />
            </div>
            <Footer />
        </div>
    );
};

export default RecommendCloset;
