import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../css/clothes/uploadClosetCheck.module.css';
import Footer from '../../jsx/fix/Footer.jsx';

const UploadClosetCheck = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <img src="public/lib/back.svg" alt="back" onClick={() => navigate('/uploadCloset')} />
                <h2>옷 등록</h2>
                <h3 onClick={() => navigate('/closetRoom')}>등록</h3>
            </div>
            <div className={styles.closetCheckImg}>
                <img src="public/lib/상의1.svg" alt="Clothing Item" />
            </div>
            <div className={styles.tags}>
                <div className={styles.tag}>
                    <label htmlFor="type">종류</label>
                    <select id="type">
                        <option value="반팔">반팔</option>
                        <option value="긴팔">긴팔</option>
                        <option value="셔츠">셔츠</option>
                    </select>
                </div>
                <div className={styles.tag}>
                    <label htmlFor="color">색상</label>
                    <select id="color">
                        <option value="초록">초록</option>
                        <option value="검정">검정</option>
                        <option value="회색">회색</option>
                        <option value="흰색">흰색</option>
                    </select>
                </div>
                <div className={styles.tag}>
                    <label htmlFor="material">소재</label>
                    <select id="material">
                        <option value="면">면</option>
                        <option value="폴리에스터">폴리에스터</option>
                        <option value="나일론">나일론</option>
                    </select>
                </div>
                <div className={styles.tag}>
                    <label htmlFor="season">계절</label>
                    <select id="season">
                        <option value="여름">여름</option>
                        <option value="봄/가을">봄/가을</option>
                        <option value="겨울">겨울</option>
                    </select>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default UploadClosetCheck;
