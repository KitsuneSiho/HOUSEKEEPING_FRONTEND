import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../css/first/firstRoomDesign.module.css';

const FirstLivingRoom = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <img
                    src="public/lib/back.svg"
                    alt="back"
                    onClick={() => navigate('/firstRoomDesign')}
                />
                <h2>내 주방 설정</h2>
            </div>
            <div className={styles.roomDesign}>
                <img className={styles.myRoom} src="public/lib/내방.png" alt="Room Design" />
            </div>
            <div className={styles.furniture}>
                <table>
                    <thead>
                    <tr>
                        <th>
                            <img src="public/lib/카테고리아이콘임시.svg" alt="icon" />
                            <img src="public/lib/카테고리아이콘임시.svg" alt="icon" />
                            <img src="public/lib/카테고리아이콘임시.svg" alt="icon" />
                            <img src="public/lib/카테고리아이콘임시.svg" alt="icon" />
                            <img src="public/lib/카테고리아이콘임시.svg" alt="icon" />
                            <img src="public/lib/카테고리아이콘임시.svg" alt="icon" />
                            <img src="public/lib/카테고리아이콘임시.svg" alt="icon" />
                        </th>
                    </tr>
                    </thead>
                </table>
            </div>
            <div className={styles.submit}>
                <button
                    type="button"
                    className={styles.cancel}
                    onClick={() => navigate('/login')}
                >
                    취소
                </button>
                <button
                    type="button"
                    className={styles.next}
                    onClick={() => navigate('/firstToiletRoom')}
                >
                    다음
                </button>
            </div>
        </div>
    );
};

export default FirstLivingRoom;
