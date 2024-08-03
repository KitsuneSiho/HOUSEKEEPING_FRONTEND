import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import styles from '../../css/myPage/guestBook.module.css';
import Footer from '../../jsx/fix/Footer.jsx';
import { BACK_URL } from "../../Constraints.js";

const GuestBook = () => {
    const navigate = useNavigate();
    const [guestBooks, setGuestBooks] = useState([]);

    // 현재 로그인 한 사용자
    const ownerId = 2;

    // API 호출하여 보관된 방명록을 가져오는 함수
    const fetchArchivedGuestBooks = async () => {
        try {
            const response = await axios.get(`${BACK_URL}/guestbook/archived/${ownerId}`);
            setGuestBooks(response.data);
        } catch (error) {
            console.error('Error fetching archived guestbooks:', error);
        }
    };

    // 컴포넌트가 마운트될 때 데이터 가져오기
    useEffect(() => {
        fetchArchivedGuestBooks();
    }, [ownerId]);

    // 방명록 삭제 핸들러
    const handleDelete = async (id) => {
        try {
            await axios.delete(`${BACK_URL}/guestbook/delete/${id}`);
            setGuestBooks(prevBooks => prevBooks.filter(book => book.guestbookId !== id));
        } catch (error) {
            console.error('Error deleting guestbook entry:', error);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <img className={styles.back} src="/lib/back.svg" alt="뒤로가기" onClick={() => navigate('/myPage')} />
                <h2>방명록 보관함</h2>
            </div>
            <div className={styles.guestbookList}>
                {guestBooks.length > 0 ? (
                    guestBooks.map(guestBook => (
                        <div key={guestBook.guestbookId} className={styles.guestbookItem}>
                            <div className={styles.guestbookHeader}>
                                <span className={styles.author}>{guestBook.writerNickname}</span>
                                <span className={styles.date}>{new Date(guestBook.guestbookTimestamp).toLocaleDateString()}</span>
                            </div>
                            <div className={styles.guestbookMessage}>
                                {guestBook.guestbookContent}
                            </div>
                            <div className={styles.guestbookDelete}>
                                <span onClick={() => handleDelete(guestBook.guestbookId)}>삭제</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>보관된 방명록이 없습니다.</p>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default GuestBook;
