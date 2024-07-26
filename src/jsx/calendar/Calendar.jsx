import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../css/calendar/calendar.module.css';
import Footer from '../../jsx/fix/Footer.jsx';

const RoutineSection = ({ title, items, onAddItem, colorClass }) => {
    const listRef = useRef(null);

    const handleAddItem = () => {
        onAddItem();
        setTimeout(() => {
            if (listRef.current) {
                listRef.current.scrollTop = listRef.current.scrollHeight;
            }
        }, 0);
    };

    return (
        <div className={styles.routineSection}>
            <div className={styles.routineHeader}>
                <div className={`${styles.routineTitle} ${styles[colorClass]}`}>
                    <img src="/lib/빗자루.svg" alt="broom" />
                    <p>{title}</p>
                    <img src="/lib/연필.svg" alt="edit" />
                </div>
                <div className={styles.alramOnOff}>
                    <p>모든 알림 켜기</p>
                </div>
            </div>
            <div className={styles.routineInfo} ref={listRef}>
                <ul>
                    {items.map((item, index) => (
                        <li key={index}>
                            <input type="checkbox" id={`${title}-routine-${index}`} />
                            <label htmlFor={`${title}-routine-${index}`}>{item.text}</label>
                            <img src={`/lib/알림${item.notification ? 'on' : 'off'}.svg`} alt="notification" />
                        </li>
                    ))}
                </ul>
            </div>
            <img src="/lib/plus.svg" alt="plus" className={styles.plusIcon} onClick={handleAddItem} />
        </div>
    );
};

const Calendar = () => {
    const navigate = useNavigate();
    const [roomRoutineItems, setRoomRoutineItems] = useState([
        { text: "일간은 +누르면 그냥 밑에 한줄 추가", notification: true },
        { text: "바닥 청소", notification: true },
        { text: "죽기", notification: false },
        { text: "죽기", notification: false },
    ]);

    const [livingRoomRoutineItems, setLivingRoomRoutineItems] = useState([
        { text: "일간은 +누르면 그냥 밑에 한줄 추가", notification: true },
        { text: "바닥 청소", notification: true },
        { text: "죽기", notification: false },
        { text: "죽기", notification: false },
    ]);

    const [toiletRoutineItems, setToiletRoutineItems] = useState([
        { text: "일간은 +누르면 그냥 밑에 한줄 추가", notification: true },
        { text: "바닥 청소", notification: true },
        { text: "죽기", notification: false },
        { text: "죽기", notification: false },
    ]);

    const addRoutineItem = (setItems) => {
        setItems(prevItems => [...prevItems, { text: "새로운 항목", notification: false }]);
    };

    return (
        <div className={styles.container}>
            <div className={styles.calendarHeader}>
                <img src="/lib/back.svg" alt="back" />
                <h2>2024년 7월</h2>
                <img src="/lib/front.svg" alt="forward" />
            </div>
            <div className={styles.calendar}>
                달력
            </div>
            <div className={styles.routineContainer}>
                <RoutineSection
                    title="방"
                    items={roomRoutineItems}
                    onAddItem={() => addRoutineItem(setRoomRoutineItems)}
                    colorClass="roomColor"
                />
                <RoutineSection
                    title="주방"
                    items={livingRoomRoutineItems}
                    onAddItem={() => addRoutineItem(setLivingRoomRoutineItems)}
                    colorClass="livingRoomColor"
                />
                <RoutineSection
                    title="화장실"
                    items={toiletRoutineItems}
                    onAddItem={() => addRoutineItem(setToiletRoutineItems)}
                    colorClass="toiletColor"
                />
            </div>
            <Footer/>
        </div>
    );
};

export default Calendar;
