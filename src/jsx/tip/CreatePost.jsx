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
            <h2>새 게시글 작성</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="제목"
                    required
                />
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="내용"
                    required
                />
                <button type="submit">게시</button>
            </form>
        </div>
    );
};

export default CreatePost;