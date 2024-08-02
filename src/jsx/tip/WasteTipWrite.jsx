import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../css/tip/wasteTipWrite.module.css';
import Footer from '../../jsx/fix/Footer.jsx';

const WasteTipWrite = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const submitForm = () => {
        // Logic to handle form submission
        alert("등록되었습니다!");
        navigate('/wasteTip');
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <img className={styles.back} src="public/lib/back.svg" alt="back" onClick={() => navigate('/wasteTip')} />
                <h2>폐기물 Tip</h2>
            </div>

            <div className={styles.formContainer}>
                <div className={styles.formGroup}>
                    <label htmlFor="title">제목</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="제목을 입력하세요"
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="content">내용</label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="내용을 입력하세요"
                    />
                </div>
                <div className={styles.submitButton}>
                    <button onClick={submitForm}>등록</button>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default WasteTipWrite;
