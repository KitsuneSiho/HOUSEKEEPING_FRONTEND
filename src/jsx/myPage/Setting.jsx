import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../css/myPage/setting.module.css';
import Footer from '../../jsx/fix/Footer.jsx';
import axiosConfig from "../../config/axiosConfig.js";

const Setting = () => {
    const navigate = useNavigate();
    const [activeStatus, setActiveStatus] = useState(true);
    const [cleaningNotifications, setCleaningNotifications] = useState(true);
    const [floatingPeriodNotifications, setFloatingPeriodNotifications] = useState(false);
    const [accountSearchAllowed, setAccountSearchAllowed] = useState(false);

    useEffect(() => {
        fetchUserSettings();
    }, []);

    const fetchUserSettings = async () => {
        try {
            const response = await axiosConfig.get('/api/user/settings');
            setFloatingPeriodNotifications(response.data.settingFoodNotice);
        } catch (error) {
            console.error('설정을 불러오는 중 오류가 발생했습니다:', error);
        }
    };

    const updateFoodNotificationSetting = async (value) => {
        try {
            await axiosConfig.put('/api/user/settings/food-notice', { settingFoodNotice: value });
            setFloatingPeriodNotifications(value);
        } catch (error) {
            console.error('설정을 업데이트하는 중 오류가 발생했습니다:', error);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <img className={styles.back} src="/lib/back.svg" alt="뒤로가기" onClick={() => navigate('/myPage')} />
                <h2>설정</h2>
            </div>
            <div className={styles.settingsList}>
                <div className={styles.settingsItem}>
                    <span>활동 중 표시</span>
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
                    <img src="/lib/물음표.svg" alt="info" />
                    청소를 안할 시 일정 오염도가 되면 전송되는 알림입니다.
                </p>
                <div className={styles.settingsItem}>
                    <span>유통기한 알림 설정</span>
                    <label className={styles.switch}>
                        <input
                            type="checkbox"
                            checked={floatingPeriodNotifications}
                            onChange={(e) => updateFoodNotificationSetting(e.target.checked)}
                        />
                        <span className={`${styles.slider} ${styles.round}`}></span>
                    </label>
                </div>
                <div className={styles.settingsItem}>
                    <span>계정 검색 허용</span>
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