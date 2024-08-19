import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from '../../css/tip/roomeTipDetail.module.css';
import Footer from '../../jsx/fix/Footer.jsx';
import axiosInstance from '../../config/axiosInstance.js';
import { useAuth } from '../../contexts/AuthContext';

const RoomeTipDetail = () => {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();
    const { user } = useAuth();

    const fetchPost = useCallback(async () => {
        try {
            const response = await axiosInstance.get(`/api/posts/${id}`);
            setPost(response.data);
        } catch (error) {
            console.error('Error fetching post:', error.response?.data || error.message);
            setError('게시글을 불러오는 데 실패했습니다.');
        }
    }, [id]);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);

        fetchPost().then(() => {
            if (isMounted) setLoading(false);
        });

        return () => {
            isMounted = false;
        };
    }, [fetchPost]);

    const editPost = () => {
        navigate(`/tip/roome/edit/${id}`);
    };

    const deletePost = async () => {
        if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
            try {
                await axiosInstance.delete(`/api/posts/${id}`);
                navigate('/tip/roome');
            } catch (error) {
                console.error('Error deleting post:', error);
            }
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!post) return <div>게시글을 찾을 수 없습니다.</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <img
                    className={styles.back}
                    src="/lib/back.svg"
                    alt="back"
                    onClick={() => navigate('/tip/roome')}
                />
                <h2>루미`s Tip</h2>
            </div>
            <div className={styles.postContainer}>
                <div className={styles.postInfoTitle}>
                    <p>제목</p>
                    <p>{post.title}</p>
                </div>
                <div className={styles.postInfoDate}>
                    <p>{new Date(post.createdAt).toLocaleDateString()}</p>
                    <p>{post.authorName || '익명'}</p>
                </div>
                <div className={styles.postContent}>
                    <p>{post.content}</p>
                </div>
                <div className={styles.buttonContainer}>
                    {user && user.role === 'ROLE_ADMIN' && (
                        <>
                            <button onClick={editPost}>수정</button>
                            <button onClick={deletePost}>삭제</button>
                        </>
                    )}
                    <button onClick={() => navigate('/tip/roome')}>목록</button>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default RoomeTipDetail;