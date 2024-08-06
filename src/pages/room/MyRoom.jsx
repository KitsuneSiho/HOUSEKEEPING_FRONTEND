import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import styles from '../../css/main/mainLivingRoom.module.css';
import Footer from '../../jsx/fix/Footer.jsx';
import RoomView from '../../jsx/room/RoomView.jsx';
import axios from "axios";
import {BACK_URL} from "../../Constraints.js";
import RoomModel from "../../components/room/RoomModel.jsx";

const MyRoom = () => {
    const [userId, setUserId] = useState("");
    const [rooms, setRooms] = useState([]);
    const [placementLists, setPlacementLists] = useState([]);
    const [currentRoom, setCurrentRoom] = useState(0);
    const [isReady, setReady] = useState(false);

    const navigate = useNavigate();
    const [routines, setRoutines] = useState([
        {id: 1, text: '일간은 +누르면 그냥 밑에 한줄 추가', checked: false, notification: true},
        {id: 2, text: '바닥 청소', checked: false, notification: true},
        {id: 3, text: '죽기', checked: false, notification: false},
        {id: 4, text: '죽기', checked: false, notification: false}
    ]);

    useEffect(() => {
        setUserId(sessionStorage.getItem("userId"));
    }, []);

    useEffect(() => {

        if (userId !== "") {

            getRoomIds();
        }
    }, [userId])

    useEffect(() => {

        if (JSON.stringify(rooms) !== JSON.stringify([])) {
            getPlacementLists().then(() => setReady(true));
        }
    }, [rooms])

    const getRoomIds = async () => {

        try {

            const response = await axios.get(BACK_URL + `/room/list?userId=${userId}`);

            setRooms(response.data);
        } catch (error) {
            console.error("Error fetching room:", error);
        }
    }

    const getPlacementLists = async () => {

        try {

            const response = await axios.get(BACK_URL + `/placement/list/all?roomIds=${rooms[0].roomId}&roomIds=${rooms[1].roomId}&roomIds=${rooms[2].roomId}`);

            setPlacementLists(response.data);
        } catch (error) {
            console.error("Error fetching placementLists", error);
        }
    }

    const changeCurrentRoom = (adder) => {

        const newRoomNumber = currentRoom + adder;

        if (newRoomNumber >= 0) {
            setCurrentRoom(newRoomNumber % 3);
        } else {
            setCurrentRoom(newRoomNumber + 3);
        }
    }

    const addRoutineItem = () => {
        setRoutines([
            ...routines,
            {id: routines.length + 1, text: '새로운 항목', checked: false, notification: false}
        ]);
    };

    return (
        <div className={styles.container}>
            <div className={styles.friendsContainer}>
                <div className={styles.friendsList}>
                    {Array.from({length: 7}, (_, i) => (
                        <div className={styles.friend} key={i} onClick={() => navigate('/friend/friendroom/:userId')}>
                            <img src={`/lib/친구${i + 1}.png`} alt={`friend${i + 1}`}/>
                            <p>{`friend_${i + 1}`}</p>
                        </div>
                    ))}
                    <div className={styles.addFriend} onClick={() => navigate('/friend/add')}>
                        <img src="/lib/plus.svg" alt="add"/>
                        <p>친구 추가</p>
                    </div>
                </div>
            </div>

            <div className={styles.dirtyBar}>
                <img src="/lib/오염도바.svg" alt="오염도 바"/>
            </div>
            <div className={styles.roomDesign}>
                <img src="/lib/왼쪽화살표.svg" alt="왼쪽 화살표" onClick={() => changeCurrentRoom(-1)}/>
                <div className={styles.roomView}>
                    {isReady && rooms.map((room, index) => (
                        <div key={index}>
                            {currentRoom === index && <RoomModel room={room} placementList={placementLists[index]}/>}
                        </div>
                    ))}
                </div>
                <img src="/lib/오른쪽화살표.svg" alt="오른쪽 화살표" onClick={() => changeCurrentRoom(1)}/>
            </div>
            <div className={styles.guestBook}>
                <p onClick={() => navigate('/main/guestbook')}>방명록</p>
            </div>
            <div className={styles.routineContainer}>
                <div className={styles.roomRoutine}>
                    <div className={styles.roomRoutineHeader}>
                        <div className={styles.roomRoutineTitle}>
                            <img src="/lib/빗자루.svg" alt="broom"/>
                            <p>{isReady && rooms[currentRoom].roomName}</p>
                            <img src="/lib/연필.svg" alt="edit"/>
                        </div>
                        <div className={styles.alramOnOff}>
                            <p>모든 알림 켜기</p>
                            <img src="/lib/plus.svg" alt="plus" className={styles.plusIcon}
                                 onClick={addRoutineItem}/>
                        </div>
                    </div>
                    <div className={styles.roomRoutineInfo}>
                        <ul>
                            {routines.map(routine => (
                                <li key={routine.id}>
                                    <input type="checkbox" id={`routine${routine.id}`}/>
                                    <label htmlFor={`routine${routine.id}`}>{routine.text}</label>
                                    <img src={routine.notification ? "/lib/알림on.svg" : "/lib/알림off.svg"}
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

export default MyRoom;
