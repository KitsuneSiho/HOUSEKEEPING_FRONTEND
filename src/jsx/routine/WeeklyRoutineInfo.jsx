import React, { useState } from 'react';
import styles from '../../css/routine/weeklyRoutineInfo.module.css';
import { useNavigate } from 'react-router-dom';
import Footer from '../../jsx/fix/Footer.jsx';

const WeeklyRoutineInfo = () => {
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
    const [currentRoutineType, setCurrentRoutineType] = useState(null);
    const [newItemText, setNewItemText] = useState('');
    const [selectedDays, setSelectedDays] = useState([]);

    const openModal = (routineType) => {
        setCurrentRoutineType(routineType);
        document.getElementById("myModal").style.display = "block";
    };

    const closeModal = () => {
        document.getElementById("myModal").style.display = "none";
        setNewItemText('');
        setSelectedDays([]);
    };

    const addRoutineItem = () => {
        if (newItemText.trim() !== '' && selectedDays.length > 0) {
            setRoutineItems((prevItems) => ({
                ...prevItems,
                [currentRoutineType]: [
                    ...prevItems[currentRoutineType],
                    { id: prevItems[currentRoutineType].length + 1, text: newItemText, notification: 'off', days: selectedDays },
                ],
            }));
            closeModal();
        }
    };

    const toggleDaySelection = (day) => {
        setSelectedDays((prevSelected) =>
            prevSelected.includes(day)
                ? prevSelected.filter((d) => d !== day)
                : [...prevSelected, day]
        );
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <img className={styles.back} src="public/lib/back.svg" alt="back" onClick={() => navigate('/routine')} />
                <h2>루미 추천 루틴</h2>
                <h3>저장</h3>
            </div>
            <div className={styles.tabs}>
                <div className={styles.tab} onClick={() => navigate('/dailyRoutineInfo')}>일간</div>
                <div className={`${styles.tab} ${styles.active}`} onClick={() => navigate('/weeklyRoutineInfo')}>주간</div>
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
                            <img src="public/lib/plus.svg" alt="plus" className={styles.plusIcon} onClick={() => openModal('roomRoutine')} />
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
                            <img src="public/lib/plus.svg" alt="plus" className={styles.plusIcon} onClick={() => openModal('livingRoomRoutine')} />
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
                            <img src="public/lib/plus.svg" alt="plus" className={styles.plusIcon} onClick={() => openModal('toiletRoutine')} />
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

            {/* Modal */}
            <div id="myModal" className={styles.modal}>
                <div className={styles.modalContent}>
                    <h2>주간 루틴 설정</h2>
                    <div className={styles.routineName}>
                        <label htmlFor="routineName">루틴 명</label>
                        <input
                            type="text"
                            id="routineName"
                            value={newItemText}
                            onChange={(e) => setNewItemText(e.target.value)}
                        />
                    </div>
                    <div className={styles.routineColor}>
                        <label htmlFor="routineColor">요일</label>
                        <div className={styles.weekdays}>
                            {['월', '화', '수', '목', '금', '토', '일'].map((day, index) => (
                                <React.Fragment key={index}>
                                    <input
                                        type="checkbox"
                                        id={day}
                                        name="weekday"
                                        value={day}
                                        checked={selectedDays.includes(day)}
                                        onChange={() => toggleDaySelection(day)}
                                    />
                                    <label htmlFor={day}>{day}</label>
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                    <button type="button" className={styles.modalAddBtn} onClick={addRoutineItem}>루틴 추가</button>
                    <button type="button" className={styles.modalCancelBtn} onClick={closeModal}>취소</button>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default WeeklyRoutineInfo;
