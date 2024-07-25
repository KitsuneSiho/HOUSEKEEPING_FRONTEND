import React from 'react';
import { useNavigate } from 'react-router-dom';  // React Router v6 사용 시

import styles from '../../css/first/login.module.css';

const Login = () => {
    const navigate = useNavigate();

    const navigateTo = (path) => {
        navigate(path);
    };

    return (
        <div className={styles.container}>
            <div className={styles.mainImg}>
                <img src="public/lib/루미.png" alt="Main Image" />
            </div>
            <div className={styles.loginButton}>
                <button
                    type="button"
                    className={styles.kakao}
                    onClick={() => navigateTo('/firstLogin')}
                >
                    <img src="public/lib/카카오아이콘.png" alt="Kakao Login" />
                </button>
                <button
                    type="button"
                    className={styles.naver}
                    onClick={() => navigateTo('/firstLogin')}
                >
                    <img src="public/lib/네이버아이콘.png" alt="Naver Login" />
                </button>
                <button
                    type="button"
                    className={styles.google}
                    onClick={() => navigateTo('/firstLogin')}
                >
                    <img src="public/lib/구글아이콘.png" alt="Google Login" />
                </button>
            </div>
            <div className={styles.loginPageText}>
                <p>House Keeping</p>
            </div>
        </div>
    );
};

export default Login;
