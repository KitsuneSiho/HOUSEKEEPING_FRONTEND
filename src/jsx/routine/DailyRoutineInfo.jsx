import React, { useState } from 'react';
import styles from '../../css/routine/dailyRoutineInfo.module.css';
import { useNavigate } from 'react-router-dom';
import Footer from '../../jsx/fix/Footer.jsx';

const DailyRoutineInfo = () => {
    const navigate = useNavigate();
    const [routineItems, setRoutineItems] = useState({
        roomRoutine: [
            { id: 1, text: '일간은 +누르면 그냥 밑에 한줄 추가', notification: 'on' },
            { id: 2, text: '바닥 청소', notification: 'on' },
            { id: 3, text: '죽기', notification: 'off' },
            { id: 4, text: '죽기', notification: 'off' },
        ],
        livingRoomRoutine: [
            { id: 1, text: '주방 청소', notification: 'on' },
            { id: 2, text: '식기 세척', notification: 'on' },
        ],
        toiletRoutine: [
            { id: 1, text: '화장실 청소', notification: 'on' },
            { id: 2, text: '세면대 청소', notification: 'off' },
        ],
    });

    const addRoutineItem = (routineType) => {
        setRoutineItems((prevItems) => ({
            ...prevItems,
            [routineType]: [
                ...prevItems[routineType],
                { id: prevItems[routineType].length + 1, text: '새로운 항목', notification: 'off' },
            ],
        }));
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <img src="public/lib/back.svg" alt="back" onClick={() => navigate('/routine')} />
                <h2>루미 추천 루틴</h2>
                <h3>저장</h3>
            </div>
            <div className={styles.tabs}>
                <div className={`${styles.tab} ${styles.active}`} onClick={() => navigate('/dailyRoutineInfo')}>일간</div>
                <div className={styles.tab} onClick={() => navigate('/weeklyRoutineInfo')}>주간</div>
                <div className={styles.tab} onClick={() => navigate('/monthlyRoutineInfo')}>월간</div>
            </div>
            <div className={styles.routineContainer}>
                <div className={styles.roomRoutine}>
                    <div className={styles.roomRoutineHeader}>
                        <div className={styles.roomRoutineTitle}>
                            <img src="public/lib/빗자루.svg" alt="broom" />
                            <p>방</p>
                            <img src="public/lib/연필.svg" alt="edit" />
                        </div>
                        <div className={styles.alramOnOff}>
                            <p>모든 알림 켜기</p>
                            <img src="public/lib/plus.svg" alt="plus" className={styles.plusIcon} onClick={() => addRoutineItem('roomRoutine')} />
                        </div>
                    </div>
                    <div className={styles.roomRoutineInfo}>
                        <ul>
                            {routineItems.roomRoutine.map(item => (
                                <li key={item.id}>
                                    <input type="checkbox" id={`routine-${item.id}`} />
                                    <label htmlFor={`routine-${item.id}`}>{item.text}</label>
                                    <img src={`public/lib/알림${item.notification}.svg`} alt={`notification ${item.notification}`} />
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className={styles.livingRoomRoutine}>
                    <div className={styles.livingRoomRoutineHeader}>
                        <div className={styles.livingRoomRoutineTitle}>
                            <img src="public/lib/빗자루.svg" alt="broom" />
                            <p>주방</p>
                            <img src="public/lib/연필.svg" alt="edit" />
                        </div>
                        <div className={styles.alramOnOff}>
                            <p>모든 알림 켜기</p>
                            <img src="public/lib/plus.svg" alt="plus" className={styles.plusIcon} onClick={() => addRoutineItem('livingRoomRoutine')} />
                        </div>
                    </div>
                    <div className={styles.livingRoomRoutineInfo}>
                        <ul>
                            {routineItems.livingRoomRoutine.map(item => (
                                <li key={item.id}>
                                    <input type="checkbox" id={`living-routine-${item.id}`} />
                                    <label htmlFor={`living-routine-${item.id}`}>{item.text}</label>
                                    <img src={`public/lib/알림${item.notification}.svg`} alt={`notification ${item.notification}`} />
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className={styles.toiletRoutine}>
                    <div className={styles.toiletRoutineHeader}>
                        <div className={styles.toiletRoutineTitle}>
                            <img src="public/lib/빗자루.svg" alt="broom" />
                            <p>화장실</p>
                            <img src="public/lib/연필.svg" alt="edit" />
                        </div>
                        <div className={styles.alramOnOff}>
                            <p>모든 알림 켜기</p>
                            <img src="public/lib/plus.svg" alt="plus" className={styles.plusIcon} onClick={() => addRoutineItem('toiletRoutine')} />
                        </div>
                    </div>
                    <div className={styles.toiletRoutineInfo}>
                        <ul>
                            {routineItems.toiletRoutine.map(item => (
                                <li key={item.id}>
                                    <input type="checkbox" id={`toilet-routine-${item.id}`} />
                                    <label htmlFor={`toilet-routine-${item.id}`}>{item.text}</label>
                                    <img src={`public/lib/알림${item.notification}.svg`} alt={`notification ${item.notification}`} />
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default DailyRoutineInfo;
