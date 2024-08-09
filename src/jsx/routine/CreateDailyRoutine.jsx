import React, { useState, useEffect } from 'react';
import styles from '../../css/routine/dailyRoutineInfo.module.css';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Footer from '../../jsx/fix/Footer.jsx';
import { BACK_URL } from '../../Constraints.js';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const CreateDailyRoutine = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { groupName } = useParams();
    const [routineItems, setRoutineItems] = useState({});
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [newRoutineText, setNewRoutineText] = useState('');
    const [selectedRoomId, setSelectedRoomId] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [pendingRoutines, setPendingRoutines] = useState({}); // 임시 저장된 루틴

    const loginUserId = 1;

    useEffect(() => {
        // 로컬 스토리지에서 데이터 불러오기
        const savedRoutines = JSON.parse(localStorage.getItem('pendingRoutines')) || {};
        setPendingRoutines(savedRoutines);

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

    }, [loginUserId]);

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
            routineInterval: "",
            routineFrequency: 'DAILY',  // 주기를 설정합니다.
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
            localStorage.setItem('pendingRoutines', JSON.stringify(updatedRoutines));
            return updatedRoutines;
        });

        console.log(pendingRoutines);

        closeAddModal();
    };

    const saveRoutines = async () => {
        try {
            // 루틴을 리스트로 변환
            const routinesToSave = [];
            for (const [roomId, routines] of Object.entries(pendingRoutines)) {
                for (const routine of routines) {
                    routinesToSave.push({
                        routineName: routine.routineName,
                        routineGroupName: groupName,
                        roomId: roomId,
                        routineInterval: routine.routineInterval,
                        routineFrequency: routine.routineFrequency,
                        routineIsAlarm: routine.routineIsAlarm,
                        routineIsChecked: routine.routineIsChecked
                    });
                }
            }

            console.log(routinesToSave);

            // 서버에 루틴 그룹 통째로 전송
            await axios.post(`${BACK_URL}/routine/group/add`, routinesToSave);

            // 루틴 저장이 성공하면 로컬 스토리지 삭제
            localStorage.removeItem('pendingRoutines');

            alert('모든 루틴이 저장되었습니다.');
            navigate('/routine');
        } catch (error) {
            console.error('Error saving routines:', error);
            alert('루틴 저장 중 오류가 발생했습니다.');
        }
    };

    const handleTabClick = (frequency) => {
        navigate(`/routine/create/${frequency}/${groupName}`);
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

    // 로컬 스토리지를 지우는 함수
    const clearLocalStorage = () => {
        localStorage.removeItem('pendingRoutines');
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <img
                    className={styles.back}
                    src="/lib/back.svg"
                    alt="back"
                    onClick={() => {
                        clearLocalStorage(); // 페이지 이동 전에 로컬 스토리지 지우기
                        navigate('/routine');
                    }}
                />
                <h2>{groupName}</h2>
                <h3 onClick={saveRoutines}>루틴 생성</h3>
            </div>
            <div className={styles.tabs}>
                <div
                    className={`${styles.tab} ${location.pathname.includes('/create/daily') ? styles.active : ''}`}
                    onClick={() => handleTabClick('daily')}
                >
                    일간
                </div>
                <div
                    className={`${styles.tab} ${location.pathname.includes('/create/weekly') ? styles.active : ''}`}
                    onClick={() => handleTabClick('weekly')}
                >
                    주간
                </div>
                <div
                    className={`${styles.tab} ${location.pathname.includes('/create/monthly') ? styles.active : ''}`}
                    onClick={() => handleTabClick('monthly')}
                >
                    월간
                </div>
            </div>
            <div className={styles.routineContainer}>
                {filteredRoutines.map(room => (
                    <div key={room.roomId} className={styles.roomRoutine}>
                        <div className={styles.roomRoutineHeader}>
                            <div className={`${styles.roomRoutineTitle} 
                                            ${room.roomName === '내 방' ? styles.roomRoutineTitle : ''} 
                                            ${room.roomName === '주방' ? styles.livingRoomRoutineTitle : ''} 
                                            ${room.roomName === '화장실' ? styles.toiletRoutineTitle : ''}`}>
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

export default CreateDailyRoutine;