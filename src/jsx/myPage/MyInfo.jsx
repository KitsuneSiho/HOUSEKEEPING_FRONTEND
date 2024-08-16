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
        phoneNumber: '',
    });
    const [profileImage, setProfileImage] = useState(null);

    useEffect(() => {
        fetchUserInfo(user.userId);
    }, []);

    useEffect(() => {
        if (user) {
            setUserInfo({
                name: user.name || '',
                nickname: user.nickname || '',
                email: user.email || '',
                phoneNumber: user.phoneNumber || '',
            });
            setProfileImage(user.profileImageUrl || "/lib/profileImg.svg");
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setUserInfo(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('userId', user.userId);

            try {
                const response = await axiosInstance.post('/api/user/update-profile-image', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                setProfileImage(response.data.profileImageUrl);
                await fetchUserInfo(user.userId);
            } catch (error) {
                console.error('Error uploading image:', error);
            }
        }
    };

    const handleUpdate = async () => {
        try {
            const updatedUserInfo = {
                ...userInfo,
                userId: user.userId
            };
            await axiosInstance.put('/api/user/update', updatedUserInfo);
            await fetchUserInfo(user.userId);
            navigate('/myPage');
        } catch (error) {
            console.error('Error updating user info', error);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <img className={styles.back} src="/lib/back.svg" alt="뒤로가기" onClick={() => navigate('/myPage')}/>
                <h2>내 정보</h2>
            </div>
            <div className={styles.profileImg}>
                <img src={profileImage} alt="프로필 이미지"/>
                <label htmlFor="profileImageUpload">프로필 이미지 수정</label>
                <input
                    type="file"
                    id="profileImageUpload"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{display: 'none'}}
                />
            </div>
            <div className={styles.information}>
                <div className={styles.inputContainer}>
                    <label htmlFor="name">이름</label>
                    <input type="text" id="name" value={userInfo.name} readOnly/>
                </div>
                <div className={styles.inputContainer}>
                    <label htmlFor="nickname">닉네임</label>
                    <input type="text" id="nickname" value={userInfo.nickname} onChange={handleInputChange}/>
                </div>
                <div className={styles.inputContainer}>
                    <label htmlFor="email">이메일</label>
                    <input type="email" id="email" value={userInfo.email} readOnly/>
                </div>
                <div className={styles.inputContainer}>
                    <label htmlFor="phoneNumber">전화번호</label>
                    <input type="text" id="phoneNumber" value={userInfo.phoneNumber} readOnly/>
                </div>
            </div>
            <div className={styles.submit}>
                <button type="button" className={styles.cancel} onClick={() => navigate('/myPage')}>취소</button>
                <button type="button" className={styles.next} onClick={handleUpdate}>수정</button>
            </div>
            <Footer/>
        </div>
    );
};

export default MyInfo;