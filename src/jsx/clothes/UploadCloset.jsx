import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../css/clothes/uploadCloset.module.css';
import Footer from '../../jsx/fix/Footer.jsx';

const UploadCloset = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <img className={styles.back} src="public/lib/back.svg" alt="back" onClick={() => navigate('/closetRoom')} />
                <h2>옷 등록</h2>
            </div>
            <div className={styles.camera}>
                <p>카메라</p>
            </div>
            <div className={styles.cameraButton}>
                <button type="button" onClick={() => navigate('/uploadClosetCheck')}>
                    촬영
                </button>
            </div>
            <Footer />
        </div>
    );
};

export default UploadCloset;
