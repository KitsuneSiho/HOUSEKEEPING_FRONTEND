import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from '../../css/tip/wasteTipDetail.module.css';
import Footer from '../../jsx/fix/Footer.jsx';
import axiosConfig from "../../config/axiosConfig.js";

const WasteTipDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [tip, setTip] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log('useEffect triggered, id:', id);
        if (id) {
            fetchTip();
            fetchComments();
        }
    }, [id]);

    const fetchTip = async () => {
        try {
            console.log('Fetching tip with id:', id);
            const response = await axiosConfig.get(`/api/tips/${id}`);
            console.log('Tip data:', response.data);
            setTip(response.data);
        } catch (error) {
            console.error('Error fetching tip:', error);
            setError('팁을 불러오는 데 실패했습니다.');
        }
    };

    const fetchComments = async () => {
        try {
            const response = await axiosConfig.get(`/api/comments/tip/${id}`);
            console.log('Comments data:', response.data);
            setComments(response.data);
        } catch (error) {
            console.error('Error fetching comments:', error);
            setError('댓글을 불러오는 데 실패했습니다.');
        }
    };

    const editPost = () => {
        navigate(`/tip/waste/edit/${id}`);
    };

    const deletePost = async () => {
        if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
            try {
                await axiosConfig.delete(`/api/tips/${id}`);
                navigate('/tip/waste');
            } catch (error) {
                console.error('Error deleting tip:', error);
            }
        }
    };

    const goToList = () => {
        navigate('/tip/waste');
    };

    const handleCommentSubmit = async () => {
        try {
            await axiosConfig.post(`/api/comments`, {
                tipId: id,
                commentContent: newComment
            });
            setNewComment('');
            fetchComments();
        } catch (error) {
            console.error('Error submitting comment:', error);
        }
    };

    const handleCommentEdit = async (commentId, newContent) => {
        try {
            await axiosConfig.put(`/api/comments/${commentId}`, {
                commentContent: newContent
            });
            fetchComments();
        } catch (error) {
            console.error('Error editing comment:', error);
        }
    };

    const handleCommentDelete = async (commentId) => {
        if (window.confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
            try {
                await axiosConfig.delete(`/api/comments/${commentId}`);
                fetchComments();
            } catch (error) {
                console.error('Error deleting comment:', error);
            }
        }
    };

    if (error) return <div>Error: {error}</div>;
    if (!tip) return <div>Loading...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <img className={styles.back} src="/lib/back.svg" alt="back" onClick={goToList} />
                <h2>폐기물 Tip</h2>
            </div>

            <div className={styles.postContainer}>
                <div className={styles.postInfoTitle}>
                    <p>제목</p>
                    <p>{tip.tipTitle}</p>
                </div>
                <div className={styles.postInfoDate}>
                    <p>{new Date(tip.tipCreatedDate).toLocaleDateString()}</p>
                    <p>{tip.author}</p>
                </div>
                <div className={styles.postContent}>
                    <p>{tip.tipContent}</p>
                </div>
                <div className={styles.buttonContainer}>
                    <button onClick={editPost}>수정</button>
                    <button onClick={deletePost}>삭제</button>
                    <button onClick={goToList}>목록</button>
                </div>
            </div>

            <div className={styles.commentsSection}>
                <div className={styles.commentInput}>
                    <input
                        type="text"
                        placeholder="댓글을 입력하세요"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                    <button onClick={handleCommentSubmit}>
                        <img src="/lib/채팅보내기.svg" alt="send" />
                    </button>
                </div>
                {comments.map((comment, index) => (
                    <div className={styles.comment} key={index}>
                        <div className={styles.commentUser}>
                            <img src="/lib/마이페이지아이콘.svg" alt="user" />
                            <p>Lv.3 {comment.userName}</p>
                            <div className={styles.commentActions}>
                                <span onClick={() => handleCommentEdit(comment.commentId, prompt('댓글을 수정하세요:', comment.commentContent))}>수정</span>
                                <span onClick={() => handleCommentDelete(comment.commentId)}>삭제</span>
                            </div>
                        </div>
                        <div className={styles.commentText}>
                            <p>{comment.commentContent}</p>
                        </div>
                        <div className={styles.commentDate}>
                            <p>{new Date(comment.commentCreatedDate).toLocaleString()}</p>
                        </div>
                    </div>
                ))}
            </div>
            <Footer />
        </div>
    );
};

export default WasteTipDetail;