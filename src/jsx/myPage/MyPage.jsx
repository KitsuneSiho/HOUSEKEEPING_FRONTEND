import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../css/myPage/myPage.module.css';
import Footer from '../../jsx/fix/Footer.jsx';
import axiosInstance from '../../config/axiosInstance.js';
import { useAuth } from '../../contexts/AuthContext';

const MyPage = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        try {
            await axiosInstance.post('/logout');
            logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed', error);
            logout();
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <img className={styles.back} src="/lib/back.svg" alt="뒤로가기" onClick={() => navigate('/main')} />
                <h2>마이페이지</h2>
            </div>
            <div className={styles.profile}>
                <div className={styles.profileInfo}>
                    <p className={styles.profileNickname}>
                        <img src="/lib/마이페이지아이콘.svg" alt="프로필 아이콘" />
                        {user?.nickname}님, 청소하세요.
                    </p>
                    <p className={styles.profileLevel}>
                        <img src="/lib/루미.png" alt="아바타" />
                        Lv.{user?.level} {user?.levelName}
                    </p>
                    <div className={styles.xpContainer}>
                        <progress className={styles.xpBar} value={user?.exp} max={user?.nextLevelExp}></progress>
                        <span className={styles.xpText}>{user?.exp}/{user?.nextLevelExp}</span>
                    </div>
                </div>
            </div>
            <div className={styles.menu}>
                <div className={styles.menuItem} onClick={() => navigate('/mypage/info')}>
                    <p>내 정보</p>
                    <img src="/lib/front.svg" alt="화살표"/>
                </div>
                <div className={styles.menuItem} onClick={() => navigate('/friend')}>
                    <p>친구 관리</p>
                    <img src="/lib/front.svg" alt="화살표"/>
                </div>
                <div className={styles.menuItem} onClick={() => navigate('/friend/request')}>
                    <p>친구 요청</p>
                    <img src="/lib/front.svg" alt="화살표"/>
                </div>
                <div className={styles.menuItem} onClick={() => navigate('/mypage/guestBook/storage')}>
                    <p>방명록 보관함</p>
                    <img src="/lib/front.svg" alt="화살표"/>
                </div>
                <div className={styles.menuItem}>
                    <p>내 방 수정</p>
                    <img src="/lib/front.svg" alt="화살표"/>
                </div>
                <div className={styles.menuItem} onClick={() => navigate('/mypage/setting')}>
                    <p>설정</p>
                    <img src="/lib/front.svg" alt="화살표"/>
                </div>
            </div>
            <div className={styles.footerMenu}>
                <p onClick={handleLogout}>로그아웃</p>
                <p onClick={() => navigate('/mypage/delete')}>회원탈퇴</p>
            </div>
            <Footer />
        </div>
    );
};

export default MyPage;