import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import styles from '../../css/main/visitorBoard.module.css';
import Footer from '../../jsx/fix/Footer.jsx';
import { BACK_URL } from "../../Constraints.js";

const VisitorBoard = () => {
    const navigate = useNavigate();
    const { userId } = useParams();
    const [guestbook, setGuestbook] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [content, setContent] = useState('');
    const [color, setColor] = useState('#c5f1ff');
    const [isPrivate, setIsPrivate] = useState(false);

    const loginUserId = 1;
    // 지금은 임시로 해둔 것
    // 현재 로그인한 사용자의 ID

    useEffect(() => {
        const fetchGuestbook = async () => {
            try {
                const response = await axios.get(`${BACK_URL}/guestbook/list/${userId}`);
                if (Array.isArray(response.data)) {
                    setGuestbook(response.data);
                } else {
                    console.error('Unexpected data format:', response.data);
                    setGuestbook([]);
                }
            } catch (error) {
                console.error('Error fetching guestbook entries:', error);
                setGuestbook([]);
            }
        };
        fetchGuestbook();
    }, [userId]);

    // Add a new entry to the guestbook
    const addEntry = async () => {
        if (content.trim() === '') {
            alert('내용을 입력해주세요.');
            return;
        }

        const newEntry = {
            guestbookContent: content,  // 방명록 내용
            guestbookIsSecret: isPrivate, // 비밀글 여부
            guestbookIsRead: false, // 읽음 여부
            guestbookTimestamp: new Date().toISOString(),
            guestbookOwnerId: userId, // 방명록 소유자의 ID
            guestbookWriterId: loginUserId // 작성자(즉, 로그인한 사용자의 ID)
        };

        try {
            const response = await axios.post(`${BACK_URL}/guestbook/write`, newEntry);
            setGuestbook([...guestbook, response.data]);
            setIsModalOpen(false);
            setContent('');
            setColor('#c5f1ff');
            setIsPrivate(false);
            console.log(response);
        } catch (error) {
            console.error('Error adding guestbook entry:', error);
        }
    };

    // Delete a guestbook entry
    const handleDelete = async (guestbookId) => {
        try {
            await axios.delete(`${BACK_URL}/guestbook/delete/${guestbookId}`);
            setGuestbook(prevEntries => prevEntries.filter(entry => entry.guestbookId !== guestbookId));
        } catch (error) {
            console.error('Error deleting guestbook entry:', error);
        }
    };


    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <img
                    src="/lib/back.svg"
                    alt="back"
                    onClick={() => navigate(`/friendRoom/${userId}`)}
                />
                <h2>님의 방명록</h2>
                <h3 className={styles.writeButton} onClick={() => setIsModalOpen(true)}>작성</h3>
            </div>

            <div className={styles.visitorBoard}>
                {guestbook.length > 0 ? (
                    guestbook.map((entry, index) => (
                        <div key={entry.guestbookId} className={styles.entry} style={{ backgroundColor: color }}>
                            <div className={styles.entryHeader}>
                                <span>{entry.writerNickname}</span>
                                <span>{new Date(entry.guestbookTimestamp).toLocaleDateString()}</span>
                            </div>
                            <div className={styles.entryContent}>
                                {entry.guestbookIsSecret ? '비밀글입니다.' : entry.guestbookContent}
                            </div>
                            <div className={styles.entryFooter}>
                                <button className={styles.deleteButton} onClick={() => handleDelete(entry.guestbookId)}>삭제</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>방명록이 없습니다.</p>
                )}
            </div>

            {isModalOpen && (
                <div className={styles.modal} onClick={() => setIsModalOpen(false)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <span className={styles.close} onClick={() => setIsModalOpen(false)}>&times;</span>
                        <div className={styles.modalTextarea}>
                            <label htmlFor="content">내용</label>
                            <textarea id="content" rows="8" value={content} onChange={(e) => setContent(e.target.value)} />
                        </div>
                        <div className={styles.colorPicker}>
                            <label>색상</label>
                            <div className={styles.colorOptions}>
                                <input type="radio" name="color" value="#c5f1ff" id="color1" checked={color === '#c5f1ff'} onChange={(e) => setColor(e.target.value)} />
                                <label htmlFor="color1" className={styles.colorLabel} style={{ backgroundColor: '#c5f1ff' }}></label>

                                <input type="radio" name="color" value="#ffc5f2" id="color2" checked={color === '#ffc5f2'} onChange={(e) => setColor(e.target.value)} />
                                <label htmlFor="color2" className={styles.colorLabel} style={{ backgroundColor: '#ffc5f2' }}></label>

                                <input type="radio" name="color" value="#ffebc5" id="color3" checked={color === '#ffebc5'} onChange={(e) => setColor(e.target.value)} />
                                <label htmlFor="color3" className={styles.colorLabel} style={{ backgroundColor: '#ffebc5' }}></label>
                            </div>
                        </div>
                        <div className={styles.privateCheckbox}>
                            <label htmlFor="private">비밀글
                                <img src="/lib/잠금.svg" alt="잠금"/>
                            </label>
                            <input type="checkbox" id="private" checked={isPrivate} onChange={() => setIsPrivate(!isPrivate)} />
                        </div>
                        <button className={styles.modalAddBtn} onClick={addEntry}>추가</button>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default VisitorBoard;
