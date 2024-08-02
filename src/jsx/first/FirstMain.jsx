import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // React Router v6
import styles from '../../css/first/firstMain.module.css';

const FirstMain = () => {
    const audioRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        // 컴포넌트가 마운트될 때 오디오 재생
        if (audioRef.current) {
            audioRef.current.play();
        }

        // 오디오 재생이 끝난 후 (또는 고정된 시간 후) 다음 페이지로 이동
        const timer = setTimeout(() => {
            navigate('/login');
        }, 5000); // 오디오 파일 길이에 따라 시간을 조정

        return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 클리어
    }, [navigate]);

    return (
        <div className={styles.container}>
            <div className={styles.mainImg}>
                <img src="/lib/HouseKeeping로고.png" className={styles.firstMainImg} alt="House Keeping 로고" />
            </div>
            <audio ref={audioRef} src="/path/to/your/audio.mp3" />
        </div>
    );
};

export default FirstMain;
