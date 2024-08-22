import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from '../../css/tip/roomeTipWrite.module.css';
import Footer from '../../jsx/fix/Footer.jsx';
import axiosInstance from '../../config/axiosInstance.js';
import { useAuth } from '../../contexts/AuthContext';

const RoomeTipEdit = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { user } = useAuth(); // 현재 로그인한 사용자 정보 가져오기
    const [post, setPost] = useState({
        title: '',
        content: '',
        category: 'ROOME',
    });

    useEffect(() => {
        if (user.role !== 'ROLE_ADMIN') {
            alert('권한이 없습니다.');
            navigate('/'); // 권한이 없을 시 홈으로 리다이렉트
        } else {
            fetchPost();
        }
    }, [user, navigate]);

    const fetchPost = async () => {
        try {
            const response = await axiosInstance.get(`/api/posts/${id}`);
            setPost(response.data);
        } catch (error) {
            console.error('Error fetching post:', error);
            handleAxiosError(error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPost(prevPost => ({
            ...prevPost,
            [name]: value
        }));
    };

    const submitForm = async () => {
        if (!post.title.trim() || !post.content.trim()) {
            alert("제목과 내용을 모두 입력해주세요.");
            return;
        }

        try {
            const response = await axiosInstance.put(`/api/posts/${id}`, post);
            console.log('Server response:', response.data);
            alert('성공적으로 수정되었습니다!');
            navigate('/tip/roome');
        } catch (error) {
            console.error('Error:', error);
            handleAxiosError(error);
        }
    };

    const handleAxiosError = (error) => {
        if (error.response) {
            console.log('Error response:', error.response.data);
            console.log('Error status:', error.response.status);
            console.log('Error headers:', error.response.headers);
            if (error.response.status === 401) {
                alert('인증에 실패했습니다. 로그인 페이지로 이동합니다.');
                localStorage.removeItem('access');
                navigate('/login');
            } else {
                alert(`게시글 수정에 실패했습니다: ${error.response.data.message || '알 수 없는 오류'}`);
            }
        } else if (error.request) {
            console.log('Error request:', error.request);
            alert("서버로부터 응답을 받지 못했습니다. 네트워크 연결을 확인해주세요.");
        } else {
            console.log('Error message:', error.message);
            alert("요청 중 오류가 발생했습니다. 나중에 다시 시도해주세요.");
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <img className={styles.back} src="/lib/back.svg" alt="back" onClick={() => navigate('/tip/roome')} />
                <h2>루미`s Tip 수정</h2>
            </div>

            <div className={styles.formContainer}>
                <div className={styles.formGroup}>
                    <label htmlFor="title">제목</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={post.title}
                        onChange={handleChange}
                        placeholder="제목을 입력하세요"
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="content">내용</label>
                    <textarea
                        id="content"
                        name="content"
                        value={post.content}
                        onChange={handleChange}
                        placeholder="내용을 입력하세요"
                    />
                </div>
                <div className={styles.submitButton}>
                    <button onClick={submitForm}>수정</button>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default RoomeTipEdit;
