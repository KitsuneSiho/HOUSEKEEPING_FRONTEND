import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../css/livingRoom/uploadFood.module.css';
import Footer from '../../jsx/fix/Footer.jsx';

const UploadFood = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <img className={styles.back}
                    src="/lib/back.svg"
                    alt="back"
                    onClick={() => navigate('/livingRoom')}
                />
                <h2>재료 등록</h2>
            </div>
            <div className={styles.camera}>
                <p>카메라</p>
            </div>
            <div className={styles.cameraButton}>
                <button
                    type="button"
                    onClick={() => navigate('/uploadFoodListCheck')}
                >
                    촬영
                </button>
            </div>
            <Footer/>
        </div>
    );
};

export default UploadFood;
