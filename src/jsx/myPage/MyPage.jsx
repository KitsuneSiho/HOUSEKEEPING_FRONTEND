import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../css/myPage/myPage.module.css';
import Footer from '../../jsx/fix/Footer.jsx';

const MyPage = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <img src="public/lib/back.svg" alt="뒤로가기" onClick={() => navigate('/mainPage')} />
                <h2>마이페이지</h2>
            </div>
            <div className={styles.profile}>
                <div className={styles.profileInfo}>
                    <p className={styles.profileNickname}>
                        <img src="public/lib/마이페이지아이콘.svg" alt="프로필 아이콘" />
                        ddak님, 청소하세요.
                    </p>
                    <p className={styles.profileLevel}>
                        <img src="public/lib/루미.png" alt="아바타" />
                        Lv.01 자린이
                    </p>
                    <div className={styles.xpContainer}>
                        <progress className={styles.xpBar} value="20" max="100"></progress>
                        <span className={styles.xpText}>20/100</span>
                    </div>
                </div>
            </div>
            <div className={styles.menu}>
                <div className={styles.menuItem} onClick={() => navigate('/myInfo')}>
                    <p>내 정보</p>
                    <img src="public/lib/front.svg" alt="화살표" />
                </div>
                <div className={styles.menuItem} onClick={() => navigate('/friendList')}>
                    <p>친구 관리</p>
                    <img src="public/lib/front.svg" alt="화살표" />
                </div>
                <div className={styles.menuItem} onClick={() => navigate('/guestBook')}>
                    <p>방명록 보관함</p>
                    <img src="public/lib/front.svg" alt="화살표" />
                </div>
                <div className={styles.menuItem}>
                    <p>내 방 수정</p>
                    <img src="public/lib/front.svg" alt="화살표" />
                </div>
                <div className={styles.menuItem}>
                    <p>아바타 수정</p>
                    <img src="public/lib/front.svg" alt="화살표" />
                </div>
                <div className={styles.menuItem} onClick={() => navigate('/setting')}>
                    <p>설정</p>
                    <img src="public/lib/front.svg" alt="화살표" />
                </div>
            </div>
            <div className={styles.footerMenu}>
                <p onClick={() => navigate('/login')}>로그아웃</p>
                <p onClick={() => navigate('/deleteUser')}>회원탈퇴</p>
            </div>
            <Footer />
        </div>
    );
};

export default MyPage;
