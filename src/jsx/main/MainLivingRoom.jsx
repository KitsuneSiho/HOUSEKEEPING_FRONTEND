import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../css/main/mainLivingRoom.module.css';
import Footer from '../../jsx/fix/Footer.jsx';
import RoomView from '../../jsx/room/RoomView.jsx';

const MainLivingRoom = () => {
    const navigate = useNavigate();
    const [routines, setRoutines] = useState([
        { id: 1, text: '일간은 +누르면 그냥 밑에 한줄 추가', checked: false, notification: true },
        { id: 2, text: '바닥 청소', checked: false, notification: true },
        { id: 3, text: '죽기', checked: false, notification: false },
        { id: 4, text: '죽기', checked: false, notification: false }
    ]);

    const addRoutineItem = () => {
        setRoutines([
            ...routines,
            { id: routines.length + 1, text: '새로운 항목', checked: false, notification: false }
        ]);
    };

    return (
        <div className={styles.container}>
            <div className={styles.friendsContainer}>
                <div className={styles.friendsList}>
                    {Array.from({length: 7}, (_, i) => (
                        <div className={styles.friend} key={i} onClick={() => navigate('/friendRoom')}>
                            <img src={`public/lib/친구${i + 1}.png`} alt={`friend${i + 1}`}/>
                            <p>{`friend_${i + 1}`}</p>
                        </div>
                    ))}
                    <div className={styles.addFriend} onClick={() => navigate('/addFriend')}>
                        <img src="public/lib/plus.svg" alt="add"/>
                        <p>친구 추가</p>
                    </div>
                </div>
            </div>

            <div className={styles.dirtyBar}>
                <img src="public/lib/오염도바.svg" alt="오염도 바"/>
            </div>
            <div className={styles.roomDesign}>
                <img src="public/lib/왼쪽화살표.svg" alt="왼쪽 화살표" onClick={() => navigate('/mainPage')}/>
                <div className={styles.roomView}>
                    <RoomView/>
                </div>
                <img src="public/lib/오른쪽화살표.svg" alt="오른쪽 화살표" onClick={() => navigate('/mainToiletRoom')}/>
            </div>
            <div className={styles.guestBook}>
                <p onClick={() => navigate('/MyGuestBook')}>방명록</p>
            </div>
            <div className={styles.routineContainer}>
                <div className={styles.roomRoutine}>
                    <div className={styles.roomRoutineHeader}>
                        <div className={styles.roomRoutineTitle}>
                            <img src="public/lib/빗자루.svg" alt="broom"/>
                            <p>주방</p>
                            <img src="public/lib/연필.svg" alt="edit"/>
                        </div>
                        <div className={styles.alramOnOff}>
                            <p>모든 알림 켜기</p>
                            <img src="public/lib/plus.svg" alt="plus" className={styles.plusIcon}
                                 onClick={addRoutineItem}/>
                        </div>
                    </div>
                    <div className={styles.roomRoutineInfo}>
                        <ul>
                            {routines.map(routine => (
                                <li key={routine.id}>
                                    <input type="checkbox" id={`routine${routine.id}`}/>
                                    <label htmlFor={`routine${routine.id}`}>{routine.text}</label>
                                    <img src={routine.notification ? "public/lib/알림on.svg" : "public/lib/알림off.svg"}
                                         alt="notification"/>
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

export default MainLivingRoom;
