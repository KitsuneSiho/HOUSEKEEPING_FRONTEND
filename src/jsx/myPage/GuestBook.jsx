import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../css/myPage/guestBook.module.css';
import Footer from '../../jsx/fix/Footer.jsx';

const GuestBook = () => {
    const navigate = useNavigate();
    const [guestBooks, setGuestBooks] = useState([
        { id: 1, author: 'bo_ddak', date: '2024.07.16', message: '대충 하셨네요...' },
        { id: 2, author: 'bo_ddak', date: '2024.07.16', message: '대충 하셨네요...' },
        { id: 3, author: 'bo_ddak', date: '2024.07.16', message: '대충 하셨네요...' },
        { id: 4, author: 'bo_ddak', date: '2024.07.16', message: '대충 하셨네요...' },
    ]);

    const handleDelete = (id) => {
        setGuestBooks(guestBooks.filter(guestBook => guestBook.id !== id));
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <img className={styles.back} src="public/lib/back.svg" alt="뒤로가기" onClick={() => navigate('/myPage')} />
                <h2>방명록 보관함</h2>
            </div>
            <div className={styles.guestbookList}>
                {guestBooks.map(guestBook => (
                    <div key={guestBook.id} className={styles.guestbookItem}>
                        <div className={styles.guestbookHeader}>
                            <span className={styles.author}>{guestBook.author}</span>
                            <span className={styles.date}>{guestBook.date}</span>
                        </div>
                        <div className={styles.guestbookMessage}>{guestBook.message}</div>
                        <div className={styles.guestbookDelete}>
                            <span onClick={() => handleDelete(guestBook.id)}>삭제</span>
                        </div>
                    </div>
                ))}
            </div>
            <Footer />
        </div>
    );
};

export default GuestBook;
