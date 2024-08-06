import React from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../services/axiosInstance';
import styles from '../../css/myPage/deleteUser.module.css';
import Footer from '../../jsx/fix/Footer.jsx';

const DeleteUser = () => {
    const navigate = useNavigate();

    const handleDeleteUser = async () => {
        try {
            await axiosInstance.delete('/api/user/delete', {
                params: { userId: 1 } // 사용자의 ID를 여기에 설정해야 합니다.
            });
            localStorage.removeItem('jwtToken'); // JWT 토큰 삭제
            navigate('/login');
        } catch (error) {
            console.error('Error deleting user', error);
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
                <button className={styles.deleteButton} onClick={handleDeleteUser}>탈퇴</button>
                <button className={styles.cancelButton} onClick={() => navigate('/myPage')}>취소</button>
            </div>
            <Footer />
        </div>
    );
};

export default DeleteUser;
