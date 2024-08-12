import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../config/axiosInstance.js';
import styles from '../../css/myPage/myInfo.module.css';
import Footer from '../../jsx/fix/Footer.jsx';
import { useAuth } from '../../contexts/AuthContext';

const MyInfo = () => {
    const navigate = useNavigate();
    const { user, fetchUserInfo } = useAuth();
    const [userInfo, setUserInfo] = useState({
        name: '',
        nickname: '',
        email: '',
        phone: '',
    });

    useEffect(() => {
        if (user) {
            setUserInfo({
                name: user.name,
                nickname: user.nickname,
                email: user.email,
                phone: user.phone,
            });
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setUserInfo(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    const handleUpdate = async () => {
        try {
            await axiosInstance.put('/api/user/update', userInfo);
            fetchUserInfo();
            navigate('/myPage');
        } catch (error) {
            console.error('Error updating user info', error);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <img className={styles.back} src="/lib/back.svg" alt="뒤로가기" onClick={() => navigate('/myPage')} />
                <h2>내 정보</h2>
            </div>
            <div className={styles.profileImg}>
                <img src="/lib/profileImg.svg" alt="프로필 이미지" />
                <p>프로필 이미지 수정</p>
            </div>
            <div className={styles.information}>
                <div className={styles.inputContainer}>
                    <label htmlFor="name">이름</label>
                    <input type="text" id="name" value={userInfo.name} onChange={handleInputChange} />
                </div>
                <div className={styles.inputContainer}>
                    <label htmlFor="nickname">닉네임</label>
                    <input type="text" id="nickname" value={userInfo.nickname} onChange={handleInputChange} />
                </div>
                <div className={styles.inputContainer}>
                    <label htmlFor="email">이메일</label>
                    <input type="email" id="email" value={userInfo.email} onChange={handleInputChange} />
                </div>
                <div className={styles.inputContainer}>
                    <label htmlFor="phone">전화번호</label>
                    <input type="text" id="phone" value={userInfo.phone} onChange={handleInputChange} />
                </div>
            </div>
            <div className={styles.submit}>
                <button type="button" className={styles.cancel} onClick={() => navigate('/myPage')}>취소</button>
                <button type="button" className={styles.next} onClick={handleUpdate}>수정</button>
            </div>
            <Footer />
        </div>
    );
};

export default MyInfo;