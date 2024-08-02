import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../css/myPage/setting.module.css';
import Footer from '../../jsx/fix/Footer.jsx';

const Setting = () => {
    const navigate = useNavigate();
    const [activeStatus, setActiveStatus] = useState(true);
    const [cleaningNotifications, setCleaningNotifications] = useState(true);
    const [floatingPeriodNotifications, setFloatingPeriodNotifications] = useState(false);
    const [accountSearchAllowed, setAccountSearchAllowed] = useState(false);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <img className={styles.back} src="public/lib/back.svg" alt="뒤로가기" onClick={() => navigate('/myPage')} />
                <h2>설정</h2>
            </div>
            <div className={styles.settingsList}>
                <div className={styles.settingsItem}>
                    <span>활동중 표시</span>
                    <label className={styles.switch}>
                        <input
                            type="checkbox"
                            checked={activeStatus}
                            onChange={() => setActiveStatus(!activeStatus)}
                        />
                        <span className={`${styles.slider} ${styles.round}`}></span>
                    </label>
                </div>
                <div className={styles.settingsItem}>
                    <span>청소 알림 설정</span>
                    <label className={styles.switch}>
                        <input
                            type="checkbox"
                            checked={cleaningNotifications}
                            onChange={() => setCleaningNotifications(!cleaningNotifications)}
                        />
                        <span className={`${styles.slider} ${styles.round}`}></span>
                    </label>
                </div>
                <p className={styles.description}>
                    <img src="public/lib/물음표.svg" alt="info" />
                    청소를 안할 시 일정 오염도가 되면 전송되는 알림입니다.
                </p>
                <div className={styles.settingsItem}>
                    <span>유동기간 알림 설정</span>
                    <label className={styles.switch}>
                        <input
                            type="checkbox"
                            checked={floatingPeriodNotifications}
                            onChange={() => setFloatingPeriodNotifications(!floatingPeriodNotifications)}
                        />
                        <span className={`${styles.slider} ${styles.round}`}></span>
                    </label>
                </div>
                <div className={styles.settingsItem}>
                    <span>계정검색허용</span>
                    <label className={styles.switch}>
                        <input
                            type="checkbox"
                            checked={accountSearchAllowed}
                            onChange={() => setAccountSearchAllowed(!accountSearchAllowed)}
                        />
                        <span className={`${styles.slider} ${styles.round}`}></span>
                    </label>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Setting;
