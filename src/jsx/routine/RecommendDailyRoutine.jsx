import React, { useState, useEffect } from 'react';
import styles from '../../css/routine/dailyRoutineInfo.module.css';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import Footer from '../../jsx/fix/Footer.jsx';
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";
import {BACK_URL} from "../../Constraints.js";

// 기본 추천 루틴을 설정하는 함수
const initializeDefaultRoutines = () => {
    const defaultRoutines = {
        '1': [ // Room ID 예시
            {
                id: uuidv4(),
                routineName: '기본 루틴 1',
                routineGroupName: '추천루틴',
                roomId: '1',
                routineInterval: '',
                routineFrequency: 'DAILY',
                routineIsAlarm: false,
                routineIsChecked: false
            }
        ],
        '2': [
            {
                id: uuidv4(),
                routineName: '기본 루틴 2',
                routineGroupName: '추천루틴',
                roomId: '2',
                routineInterval: '',
                routineFrequency: 'DAILY',
                routineIsAlarm: false,
                routineIsChecked: false
            }
        ]
    };

    localStorage.setItem('defaultRoutines', JSON.stringify(defaultRoutines));
};

const RecommendDailyRoutine = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [routineItems, setRoutineItems] = useState({});
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [newRoutineText, setNewRoutineText] = useState('');
    const [selectedRoomId, setSelectedRoomId] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [pendingRoutines, setPendingRoutines] = useState({}); // 임시 저장된 루틴
    const [groupName, setGroupName] = useState('추천루틴');

    const loginUserId = 1;


    useEffect(() => {
        // 로컬 스토리지에서 기본 추천 루틴을 초기화합니다.
        if (!localStorage.getItem('defaultRoutines')) {
            initializeDefaultRoutines();
        }

        // 방 정보 가져오기
        const fetchRooms = async () => {
            try {
                const response = await axios.get(`${BACK_URL}/room/list`, {
                    params: { userId: loginUserId }
                });
                setRooms(response.data);
            } catch (error) {
                console.error('Error fetching rooms:', error);
            }
        };

        fetchRooms();

        // 기본 추천 루틴을 로컬 스토리지에서 불러옵니다.
        const savedRoutines = JSON.parse(localStorage.getItem('defaultRoutines')) || {};
        setRoutineItems(savedRoutines);
        setPendingRoutines(savedRoutines);


    }, []);

    const addRoutineItem = () => {
        if (selectedRoomId === null || newRoutineText.trim() === '') {
            alert('방 ID가 없거나 새로운 루틴 이름이 비어 있습니다.');
            return;
        }

        const newRoutine = {
            id: uuidv4(),
            routineName: newRoutineText,
            routineGroupName: groupName,
            roomId: selectedRoomId,
            routineInterval: '',
            routineFrequency: 'DAILY',
            routineIsAlarm: false,
            routineIsChecked: false
        };

        setPendingRoutines(prev => {
            const updatedRoutines = {
                ...prev,
                [selectedRoomId]: [
                    ...(prev[selectedRoomId] || []),
                    newRoutine
                ]
            };
            localStorage.setItem('defaultRoutines', JSON.stringify(updatedRoutines));
            return updatedRoutines;
        });

        closeAddModal();
    };

    const saveRoutines = () => {
        // 로컬 스토리지에서 추천 루틴 저장
        localStorage.setItem('defaultRoutines', JSON.stringify(pendingRoutines));
        alert('모든 루틴이 저장되었습니다.');
        navigate('/routine');
    };

    const handleTabClick = (frequency) => {
        navigate(`/routine/recommend/${frequency}`);
    };

    const openAddModal = (roomId) => {
        setSelectedRoomId(roomId);
        setAddModalOpen(true);
    };

    const closeAddModal = () => {
        setAddModalOpen(false);
        setNewRoutineText('');
        setSelectedRoomId(null);
    };

    // 주기별로 필터링된 루틴을 가져오는 함수
    const getFilteredRoutines = (frequency) => {
        return rooms.map(room => {
            const roomRoutines = (pendingRoutines[room.roomId] || []).filter(routine => routine.routineFrequency === frequency);
            return {
                ...room,
                routines: roomRoutines
            };
        });
    };

    const filteredRoutines = getFilteredRoutines('DAILY'); // 현재 페이지에 맞는 루틴을 필터링합니다.

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <img
                    className={styles.back}
                    src="/lib/back.svg"
                    alt="back"
                    onClick={() => {
                        navigate('/routine');
                    }}
                />
                <h2>{groupName}</h2>
                <h3 onClick={saveRoutines}>루틴 수정</h3>
            </div>
            <div className={styles.tabs}>
                <div
                    className={`${styles.tab} ${location.pathname.includes('/recommend/daily') ? styles.active : ''}`}
                    onClick={() => handleTabClick('daily')}
                >
                    일간
                </div>
                <div
                    className={`${styles.tab} ${location.pathname.includes('/recommend/weekly') ? styles.active : ''}`}
                    onClick={() => handleTabClick('weekly')}
                >
                    주간
                </div>
                <div
                    className={`${styles.tab} ${location.pathname.includes('/recommend/monthly') ? styles.active : ''}`}
                    onClick={() => handleTabClick('monthly')}
                >
                    월간
                </div>
            </div>
            <div className={styles.routineContainer}>
                {filteredRoutines.map(room => (
                    <div key={room.roomId} className={styles.roomRoutine}>
                        <div className={styles.roomRoutineHeader}>
                            <div className={styles.roomRoutineTitle}>
                                <p>{room.roomName}</p>
                                <img src="/lib/연필.svg" alt="edit"/>
                            </div>
                            <div className={styles.alramOnOff}>
                                <p>모든 알림 켜기</p>
                                <img
                                    src="/lib/plus.svg"
                                    alt="plus"
                                    className={styles.plusIcon}
                                    onClick={() => openAddModal(room.roomId)}
                                />
                            </div>
                        </div>
                        <div className={styles.roomRoutineInfo}>
                            <ul>
                                {room.routines.map(item => (
                                    <li key={item.id}>
                                        <label htmlFor={`routine-${item.id}`}>{item.routineName}</label>
                                        <img src={`/lib/알림${item.routineIsAlarm ? 'on' : 'off'}.svg`}
                                             alt={`notification ${item.routineIsAlarm ? 'on' : 'off'}`}/>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>

            {addModalOpen && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h2>루틴 추가</h2>
                        <input
                            type="text"
                            value={newRoutineText}
                            onChange={(e) => setNewRoutineText(e.target.value)}
                        />
                        <div className={styles.buttonGroup}>
                            <button onClick={addRoutineItem}>추가</button>
                            <button onClick={closeAddModal}>취소</button>
                        </div>
                    </div>
                </div>
            )}
            <Footer/>
        </div>
    );
};

export default RecommendDailyRoutine;
