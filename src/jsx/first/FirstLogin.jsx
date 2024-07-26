import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../css/first/firstLogin.module.css';

const FirstLogin = () => {
    const navigate = useNavigate();

    const navigateTo = (path) => {
        navigate(path);
    };

    return (
        <div className={styles.container}>
            <div className={styles.firstLoginTitle}>
                <h1>가입 정보</h1>
            </div>
            <div className={styles.profileImg}>
                <img src="public/lib/profileImg.svg" alt="프로필 이미지" />
                <p>프로필 이미지 설정</p>
            </div>
            <div className={styles.information}>
                <div className={styles.inputContainer}>
                    <label htmlFor="name">이름</label>
                    <input type="text" id="name" />
                </div>
                <div className={styles.inputContainer}>
                    <label htmlFor="nickname">닉네임</label>
                    <input type="text" id="nickname" />
                </div>
                <div className={styles.inputContainer}>
                    <label htmlFor="email">이메일</label>
                    <input type="text" id="email" />
                </div>
                <div className={styles.inputContainer}>
                    <label htmlFor="phone">전화번호</label>
                    <input type="text" id="phone" />
                </div>
            </div>
            <div className={styles.submit}>
                <button
                    type="button"
                    className={styles.cancel}
                    onClick={() => navigateTo('/login')}
                >취소</button>
                <button
                    type="button"
                    className={styles.next}
                    onClick={() => navigateTo('/firstRoomDesign')}
                >다음</button>
            </div>
        </div>
    );
};

export default FirstLogin;
