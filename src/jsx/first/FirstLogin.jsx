import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import styles from '../../css/first/firstLogin.module.css';

const FirstLogin = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [userInfo, setUserInfo] = useState({
        name: '',
        nickname: '',
        email: '',
        phone: '',
        provider: ''
    });
    const [nicknameError, setNicknameError] = useState('');

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const email = searchParams.get('email');
        const name = searchParams.get('name');
        const provider = searchParams.get('provider');
        const phoneNumber = searchParams.get('phoneNumber');

        setUserInfo(prevState => ({
            ...prevState,
            email,
            name,
            provider,
            phone: phoneNumber || ''
        }));
    }, [location]);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setUserInfo(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    const handleSubmit = async () => {
        try {
            await axios.post('/api/user/complete-registration', userInfo);
            navigate('/firstRoomDesign');
        } catch (error) {
            if (error.response && error.response.data === "Nickname already exists") {
                setNicknameError('이미 사용 중인 닉네임입니다.');
            } else {
                console.error('Error completing registration', error);
            }
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.firstLoginTitle}>
                <h1>가입 정보</h1>
            </div>
            <div className={styles.profileImg}>
                <img src="/lib/profileImg.svg" alt="프로필 이미지" />
                <p>프로필 이미지 설정</p>
            </div>
            <div className={styles.information}>
                <div className={styles.inputContainer}>
                    <label htmlFor="name">이름</label>
                    <input type="text" id="name" value={userInfo.name} onChange={handleInputChange} readOnly />
                </div>
                <div className={styles.inputContainer}>
                    <label htmlFor="nickname">닉네임</label>
                    <input type="text" id="nickname" value={userInfo.nickname} onChange={handleInputChange} />
                    {nicknameError && <p className={styles.error}>{nicknameError}</p>}
                </div>
                <div className={styles.inputContainer}>
                    <label htmlFor="email">이메일</label>
                    <input type="text" id="email" value={userInfo.email} onChange={handleInputChange} readOnly />
                </div>
                <div className={styles.inputContainer}>
                    <label htmlFor="phone">전화번호</label>
                    <input type="text" id="phone" value={userInfo.phone} onChange={handleInputChange} />
                </div>
            </div>
            <div className={styles.submit}>
                <button
                    type="button"
                    className={styles.cancel}
                    onClick={() => navigate('/login')}
                >취소</button>
                <button
                    type="button"
                    className={styles.next}
                    onClick={handleSubmit}
                >다음</button>
            </div>
        </div>
    );
};

export default FirstLogin;
