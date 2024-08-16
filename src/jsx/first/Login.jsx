import React from 'react';
import styles from '../../css/first/login.module.css';
import {BACK_URL} from "../../Constraints.js";

const Login = () => {
    const handleOAuth2Login = (provider) => {
        window.location.href = `${BACK_URL}/oauth2/authorization/${provider}`;
    };

    return (
        <div className={styles.container}>
            <div className={styles.mainImg}>
                <img src="/lib/루미.png" alt="Main Image" />
            </div>
            <div className={styles.loginButton}>
                <button
                    type="button"
                    className={styles.kakao}
                    onClick={() => handleOAuth2Login('kakao')}
                >
                    <img src="/lib/카카오아이콘.png" alt="Kakao Login" />
                </button>
                <button
                    type="button"
                    className={styles.naver}
                    onClick={() => handleOAuth2Login('naver')}
                >
                    <img src="/lib/네이버아이콘.png" alt="Naver Login" />
                </button>
                <button
                    type="button"
                    className={styles.google}
                    onClick={() => handleOAuth2Login('google')}
                >
                    <img src="/lib/구글아이콘.png" alt="Google Login" />
                </button>
            </div>
            <div className={styles.loginPageText}>
                <p>House Keeping</p>
            </div>
        </div>
    );
};

export default Login;