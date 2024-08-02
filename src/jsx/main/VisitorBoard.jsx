import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../css/main/visitorBoard.module.css';
import Footer from '../../jsx/fix/Footer.jsx';

const VisitorBoard = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [content, setContent] = useState('');
    const [color, setColor] = useState('#c5f1ff');
    const [isPrivate, setIsPrivate] = useState(false);
    const [entries, setEntries] = useState([]);

    const addEntry = () => {
        if (content.trim() === '') {
            alert('내용을 입력해주세요.');
            return;
        }

        const newEntry = {
            content: isPrivate ? '비밀글입니다.' : content,
            color,
            date: new Date().toISOString().split('T')[0],
            isPrivate,
        };

        setEntries([...entries, newEntry]);
        setIsModalOpen(false);
        setContent('');
        setColor('#c5f1ff');
        setIsPrivate(false);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <img className={styles.back}
                    src="/lib/back.svg"
                    alt="back"
                    onClick={() => navigate('/friendRoom')}
                />
                <h2>___님의 방명록</h2>
                <h3 className={styles.writeButton} onClick={() => setIsModalOpen(true)}>작성</h3>
            </div>

            <div className={styles.visitorBoard}>
                {entries.map((entry, index) => (
                    <div key={index} className={styles.entry} style={{ backgroundColor: entry.color }}>
                        <div className={styles.entryHeader}>
                            <span>익명</span>
                            <span>{entry.date}</span>
                        </div>
                        <div className={styles.entryContent}>
                            {entry.content}
                        </div>
                        <div className={styles.entryFooter}>
                            <button className={styles.viewButton} onClick={() => setEntries(entries.map((e, i) => i === index ? { ...e, content: e.isPrivate ? content : '비밀글입니다.' } : e))}>보기</button>
                            <button className={styles.deleteButton} onClick={() => setEntries(entries.filter((_, i) => i !== index))}>삭제</button>
                        </div>
                    </div>
                ))}
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
                        <button className={styles.modalAddBtn} onClick={addEntry}>작성</button>
                        <button className={styles.modalCancelBtn} onClick={() => setIsModalOpen(false)}>취소</button>
                    </div>
                </div>
            )}
            <Footer />
        </div>
    );
};

export default VisitorBoard;
