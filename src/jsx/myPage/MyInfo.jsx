import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../css/myPage/myInfo.module.css';
import Footer from '../../jsx/fix/Footer.jsx';

const MyInfo = () => {
    const navigate = useNavigate();

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
                    <input type="text" id="name" placeholder="이름을 입력하세요" />
                </div>
                <div className={styles.inputContainer}>
                    <label htmlFor="nickname">닉네임</label>
                    <input type="text" id="nickname" placeholder="닉네임을 입력하세요" />
                </div>
                <div className={styles.inputContainer}>
                    <label htmlFor="email">이메일</label>
                    <input type="email" id="email" placeholder="이메일을 입력하세요" />
                </div>
                <div className={styles.inputContainer}>
                    <label htmlFor="phone">전화번호</label>
                    <input type="text" id="phone" placeholder="전화번호를 입력하세요" />
                </div>
            </div>
            <div className={styles.submit}>
                <button type="button" className={styles.cancel} onClick={() => navigate('/myPage')}>취소</button>
                <button type="button" className={styles.next} onClick={() => navigate('/myPage')}>수정</button>
            </div>
            <Footer />
        </div>
    );
};

export default MyInfo;
