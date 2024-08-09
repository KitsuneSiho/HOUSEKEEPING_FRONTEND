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
        phoneNumber: '',
        userPlatform: '',
        role: 'ROLE_USER',
        username: ''
    });
    const [token, setToken] = useState('');
    const [nicknameError, setNicknameError] = useState('');
    const [authError, setAuthError] = useState('');

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const accessToken = params.get('token');
        setToken(accessToken);

        // 토큰을 로컬 스토리지에 저장
        if (accessToken) {
            localStorage.setItem('access', accessToken);
        }

        setUserInfo(prevState => ({
            ...prevState,
            name: decodeURIComponent(params.get('name') || ''),
            email: decodeURIComponent(params.get('email') || ''),
            phoneNumber: decodeURIComponent(params.get('phoneNumber') || ''),
            userPlatform: params.get('provider') || '',
            username: decodeURIComponent(params.get('email') || '')
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
            const response = await axios.post('http://localhost:8080/api/auth/complete-registration', userInfo, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (response.status === 200) {
                navigate('/design/myroom');
            }
        } catch (error) {
            console.error('Error completing registration', error);
            if (error.response) {
                if (error.response.status === 401) {
                    setAuthError('Unauthorized access. Please check your token.');
                } else if (error.response.data === "Nickname already exists") {
                    setNicknameError('이미 사용 중인 닉네임입니다.');
                } else {
                    setAuthError(error.response.data || 'An unexpected error occurred. Please try again later.');
                }
            } else {
                setAuthError('An unexpected error occurred. Please try again later.');
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
                    <input type="text" id="name" value={userInfo.name} readOnly />
                </div>
                <div className={styles.inputContainer}>
                    <label htmlFor="nickname">닉네임</label>
                    <input type="text" id="nickname" value={userInfo.nickname} onChange={handleInputChange} />
                    {nicknameError && <p className={styles.error}>{nicknameError}</p>}
                </div>
                <div className={styles.inputContainer}>
                    <label htmlFor="email">이메일</label>
                    <input type="text" id="email" value={userInfo.email} readOnly />
                </div>
                <div className={styles.inputContainer}>
                    <label htmlFor="phoneNumber">전화번호</label>
                    <input
                        type="text"
                        id="phoneNumber"
                        value={userInfo.phoneNumber}
                        onChange={handleInputChange}
                        readOnly={userInfo.userPlatform !== 'GOOGLE'}
                    />
                </div>
                {authError && <p className={styles.error}>{authError}</p>}
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