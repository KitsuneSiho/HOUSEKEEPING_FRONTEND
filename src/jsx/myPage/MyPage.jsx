import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../css/myPage/myPage.module.css';
import Footer from '../../jsx/fix/Footer.jsx';
import axiosInstance from '../../api/axiosInstance.js';
import { useLogin } from '../../contexts/AuthContext';
import { Cookies } from "react-cookie";

const MyPage = () => {
    const navigate = useNavigate();
    const { setIsLoggedIn } = useLogin();

    const handleLogout = async () => {
        try {
            // 백엔드의 로그아웃 엔드포인트로 POST 요청을 보냅니다.
            await axiosInstance.post('/logout');

            // 로그아웃 처리 함수 호출
            performLogout();
        } catch (error) {
            console.error('Logout failed', error);
            // 에러 발생 시에도 로컬의 로그인 상태를 초기화합니다.
            performLogout();
        }
    };

    const performLogout = () => {
        // 로컬 스토리지에서 토큰을 제거합니다.
        localStorage.removeItem('access');

        // 쿠키에서 refresh 토큰을 제거합니다.
        const cookies = new Cookies();
        cookies.remove("refresh");

        // 로그인 상태를 false로 설정합니다.
        setIsLoggedIn(false);

        // 로그인 페이지로 이동합니다.
        navigate('/login');
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
                        ddak님, 청소하세요.
                    </p>
                    <p className={styles.profileLevel}>
                        <img src="/lib/루미.png" alt="아바타" />
                        Lv.01 자린이
                    </p>
                    <div className={styles.xpContainer}>
                        <progress className={styles.xpBar} value="20" max="100"></progress>
                        <span className={styles.xpText}>20/100</span>
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