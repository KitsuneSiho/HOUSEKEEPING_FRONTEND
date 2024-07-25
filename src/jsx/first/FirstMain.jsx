import React from 'react';
import styles from '../../css/first/firstMain.module.css';

const FirstMain = () => {
    return (
        <div className={styles.container}>
            <div className={styles.mainImg}>
                <img src="public/lib/HouseKeeping로고.png" className={styles.firstMainImg} alt="House Keeping 로고" />
            </div>
        </div>
    );
};

export default FirstMain;
