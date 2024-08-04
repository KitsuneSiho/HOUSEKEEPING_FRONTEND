import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import styles from '../../css/main/visitorBoard.module.css';
import Footer from '../../jsx/fix/Footer.jsx';
import { BACK_URL } from "../../Constraints.js";

const colorMapping = {
    BLUE: '#c5f1ff',
    PINK: '#ffc5f2',
    YELLOW: '#ffebc5'
};

const MyGuestBook = () => {
    const navigate = useNavigate();
    const { userId } = useParams();
    const [guestbook, setGuestbook] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [content, setContent] = useState('');
    const [color, setColor] = useState(colorMapping.BLUE);
    const [isPrivate, setIsPrivate] = useState(false);
    const [isArchived, setIsArchived] = useState(false);

    // 현재 로그인 중인 사용자
    const ownerId = 2;

    useEffect(() => {
        const fetchGuestbook = async () => {
            try {
                const response = await axios.get(`${BACK_URL}/guestbook/list/${ownerId}`);
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
    }, [ownerId]);

    const addEntry = async () => {
        if (content.trim() === '') {
            alert('내용을 입력해주세요.');
            return;
        }

        const newEntry = {
            guestbookContent: content,
            guestbookIsSecret: isPrivate,
            guestbookIsRead: false,
            guestbookTimestamp: new Date().toISOString(),
            guestbookOwnerId: userId,
            guestbookWriterId: loginUserId,
            guestbookColor: Object.keys(colorMapping).find(key => colorMapping[key] === color),
            guestbookIsArchived: isArchived
        };

        try {
            const response = await axios.post(`${BACK_URL}/guestbook/write`, newEntry);
            setGuestbook([...guestbook, response.data]);
            setIsModalOpen(false);
            setContent('');
            setColor(colorMapping.BLUE);
            setIsPrivate(false);
            setIsArchived(false);
        } catch (error) {
            console.error('Error adding guestbook entry:', error);
        }
    };

    const handleDelete = async (guestbookId) => {
        try {
            await axios.delete(`${BACK_URL}/guestbook/delete/${guestbookId}`);
            setGuestbook(prevEntries => prevEntries.filter(entry => entry.guestbookId !== guestbookId));
        } catch (error) {
            console.error('Error deleting guestbook entry:', error);
        }
    };

    const handleArchive = async (guestbookId) => {
        try {
            await axios.patch(`${BACK_URL}/guestbook/archive/${guestbookId}`);
            // Remove the archived entry from the list
            setGuestbook(prevEntries =>
                prevEntries.filter(entry => entry.guestbookId !== guestbookId)
            );
        } catch (error) {
            console.error('Error updating guestbook entry:', error);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <img className={styles.back}
                    src="/lib/back.svg"
                    alt="back"
                    onClick={() => navigate(`/main`)}
                />
                <h2>내 방명록</h2>
                <h3 className={styles.writeButton} onClick={() => setIsModalOpen(true)}>작성</h3>
            </div>

            <div className={styles.visitorBoard}>
                {guestbook.length > 0 ? (
                    guestbook
                        .filter(entry => !entry.guestbookIsArchived) // 보관된 항목은 제외
                        .map((entry) => (
                            <div
                                key={entry.guestbookId}
                                className={styles.entry}
                                style={{ backgroundColor: colorMapping[entry.guestbookColor] || '#fff' }}
                            >
                                <div className={styles.entryHeader}>
                                    <span>{entry.guestbookIsSecret ? '익명': entry.writerNickname}</span>
                                    <span>{new Date(entry.guestbookTimestamp).toLocaleDateString()}</span>
                                </div>
                                <div className={styles.entryContent}>
                                    {entry.guestbookIsSecret ? '비밀글입니다.' : entry.guestbookContent}
                                </div>
                                <div className={styles.entryFooter}>
                                    <button className={styles.archiveButton} onClick={() => handleArchive(entry.guestbookId)}>
                                        보관
                                    </button>
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
                                <input type="radio" name="color" value={colorMapping.BLUE} id="color1" checked={color === colorMapping.BLUE}
                                       onChange={(e) => setColor(e.target.value)}/>
                                <label htmlFor="color1" className={styles.colorLabel}
                                       style={{backgroundColor: colorMapping.BLUE}}></label>

                                <input type="radio" name="color" value={colorMapping.PINK} id="color2" checked={color === colorMapping.PINK}
                                       onChange={(e) => setColor(e.target.value)}/>
                                <label htmlFor="color2" className={styles.colorLabel}
                                       style={{backgroundColor: colorMapping.PINK}}></label>

                                <input type="radio" name="color" value={colorMapping.YELLOW} id="color3" checked={color === colorMapping.YELLOW}
                                       onChange={(e) => setColor(e.target.value)}/>
                                <label htmlFor="color3" className={styles.colorLabel}
                                       style={{backgroundColor: colorMapping.YELLOW}}></label>
                            </div>
                        </div>
                        <div className={styles.privateCheckbox}>
                            <label htmlFor="private">비밀글
                                <img src="/lib/잠금.svg" alt="잠금"/>
                            </label>
                            <input type="checkbox" id="private" checked={isPrivate}
                                   onChange={() => setIsPrivate(!isPrivate)}/>
                        </div>
                        <button className={styles.modalAddBtn} onClick={addEntry}>추가</button>
                    </div>
                </div>
            )}

            <Footer/>
        </div>
    );
};

export default MyGuestBook;
