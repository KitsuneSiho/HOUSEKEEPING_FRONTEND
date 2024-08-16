import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../config/axiosInstance.js';
import styles from '../../css/myPage/deleteUser.module.css';
import Footer from '../../jsx/fix/Footer.jsx';
import { useAuth } from '../../contexts/AuthContext';

const DeleteUser = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();  // user 객체를 가져옵니다.
    const [error, setError] = useState('');

    const handleDeleteUser = async () => {
        if (window.confirm('정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
            try {
                if (!user || !user.userId) {
                    throw new Error('사용자 정보를 찾을 수 없습니다.');
                }
                await axiosInstance.delete(`/api/user/delete?userId=${user.userId}`);
                logout();  // AuthContext의 logout 함수 호출
                navigate('/login');  // 로그인 페이지로 리다이렉트
            } catch (error) {
                console.error('Failed to delete user', error);
                setError('회원 탈퇴 중 오류가 발생했습니다. 다시 시도해 주세요.');
            }
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <img className={styles.back} src="/lib/back.svg" alt="뒤로가기" onClick={() => navigate('/myPage')} />
                <h2>회원탈퇴</h2>
            </div>
            <div className={styles.deleteBox}>
                <h2>정말 탈퇴하시겠어요?</h2>
                <h4>탈퇴 버튼 선택 시, 계정은</h4>
                <h4>삭제되며 복구되지 않습니다.</h4>
                {error && <p className={styles.errorMessage}>{error}</p>}
                <button className={styles.deleteButton} onClick={handleDeleteUser}>탈퇴</button>
                <button className={styles.cancelButton} onClick={() => navigate('/myPage')}>취소</button>
            </div>
            <Footer />
        </div>
    );
};

export default DeleteUser;