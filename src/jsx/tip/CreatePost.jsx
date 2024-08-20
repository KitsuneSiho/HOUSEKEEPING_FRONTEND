import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../css/tip/createPost.module.css';
import axiosInstance from '../../config/axiosInstance.js';

const CreatePost = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.post('/api/posts', { title, content, category: 'ROOME' });
            navigate('/tip/roome');
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <img className={styles.back} src="/lib/back.svg" alt="back" onClick={() => navigate('/tip/roome')}/>
                <h2>루미`s Tip 작성</h2>
            </div>
            <div className={styles.formContainer} onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label>제목</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="제목을 입력하세요"
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label>내용</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="내용을 입력하세요"
                        required
                    />
                </div>
                <div className={styles.submitButton}>
                    <button type="submit">등록</button>
                </div>
            </div>
        </div>
    );
};

export default CreatePost;