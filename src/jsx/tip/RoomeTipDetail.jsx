import React, { useState, useEffect } from 'react';
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

    useEffect(() => {
        console.log("Fetching post with id:", id);
        fetchPost();
    }, [id]);

    const fetchPost = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`/api/posts/${id}`);
            console.log('Fetched post data:', response.data);
            setPost(response.data);
        } catch (error) {
            console.error('Error fetching post:', error.response?.data || error.message);
            setError('게시글을 불러오는 데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

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
                <img className={styles.back} src="/lib/back.svg" alt="back" onClick={() => navigate('/tip/roome')} />
                <h2>루미`s Tip</h2>
            </div>

            <div className={styles.postContainer}>
                <div className={styles.postInfoTitle}>
                    <p>제목</p>
                    <p>{post.title}</p>
                </div>
                <div className={styles.postInfoDate}>
                    <p>{new Date(post.createdAt).toLocaleDateString()}</p>
                    <p>{post.authorName || '익명'}</p>  {/* post.author.nickname 대신 post.authorName 사용 */}
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


            <div className={styles.commentsSection}>
                <div className={styles.commentInput}>
                    <input type="text" placeholder="댓글을 입력하세요" />
                    <button>
                        <img src="/lib/채팅보내기.svg" alt="send" />
                    </button>
                </div>
                {/* 댓글 목록을 여기에 렌더링합니다. 현재는 더미 데이터를 사용합니다. */}
                {[...Array(5)].map((_, index) => (
                    <div className={styles.comment} key={index}>
                        <div className={styles.commentUser}>
                            <img src="/lib/마이페이지아이콘.svg" alt="user icon" />
                            <p>Lv.3 ddak</p>
                            <div className={styles.commentActions}>
                                <span>수정</span>
                                <span>삭제</span>
                            </div>
                        </div>
                        <div className={styles.commentText}>
                            <p>네 맞습니다.</p>
                        </div>
                    </div>
                ))}
            </div>
            <Footer />
        </div>
    );
};

export default RoomeTipDetail;