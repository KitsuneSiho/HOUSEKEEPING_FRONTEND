import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../css/routine/routineEdit.module.css'; // CSS 모듈 사용
import Footer from '../../jsx/fix/Footer.jsx';

const Routine = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <div className={styles.routineTitle}>
                <h1>내 청소 루틴</h1>
            </div>
            <div className={styles.routineEditAdd}>
                <p className={styles.edit} onClick={() => navigate('/routine')}>수정 완료</p>
            </div>
            <div className={styles.routine}>
                <button type="button" className={styles.roomeRoutine}>
                    <p>루미가 추천해주는 루틴♬</p>
                </button>
            </div>
            <div className={styles.routine}>
                <p className={styles.onRoutine}>현재 적용 중인 루틴</p>
                <button type="button" className={styles.myRoutine}>
                    <p>내 청소 루틴</p>
                </button>
            </div>
            <Footer/>
        </div>
    );
};

export default Routine;
