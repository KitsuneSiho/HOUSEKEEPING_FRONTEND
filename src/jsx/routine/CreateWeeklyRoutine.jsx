import React, { useState, useEffect } from 'react';
import styles from '../../css/routine/weeklyRoutineInfo.module.css';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Footer from '../../jsx/fix/Footer.jsx';
import { BACK_URL } from '../../Constraints.js';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const CreateWeeklyRoutine = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { groupName } = useParams();
    const [routineItems, setRoutineItems] = useState({});
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [newRoutineText, setNewRoutineText] = useState('');
    const [editRoutineText, setEditRoutineText] = useState('');
    const [selectedRoomId, setSelectedRoomId] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [pendingRoutines, setPendingRoutines] = useState({});
    const [selectedDays, setSelectedDays] = useState([]);
    const [routineToEdit, setRoutineToEdit] = useState(null);

    const loginUserId = 1;

    useEffect(() => {
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

    const clearLocalStorage = () => {
        localStorage.removeItem('pendingRoutines');
    };

    const toggleDaySelection = (day) => {
        setSelectedDays((prev) =>
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
        );
    };

    const addRoutineItem = () => {
        if (selectedRoomId === null || newRoutineText.trim() === '' || selectedDays.length === 0) {
            alert('방 ID, 루틴 이름, 그리고 적어도 하나의 요일을 선택해야 합니다.');
            return;
        }

        const newRoutine = {
            id: uuidv4(),
            routineName: newRoutineText,
            routineGroupName: groupName,
            roomId: selectedRoomId,
            routineInterval: selectedDays.join(','),
            routineFrequency: 'WEEKLY',
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

        closeAddModal();
    };

    const saveRoutines = async () => {
        try {
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

            await axios.post(`${BACK_URL}/routine/group/add`, routinesToSave);

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
        setSelectedDays([]);
    };

    const openEditModal = (routine) => {
        setRoutineToEdit(routine);
        setEditRoutineText(routine.routineName);
        setSelectedDays(routine.routineInterval.split(','));
        setEditModalOpen(true);
    };

    const closeEditModal = () => {
        setEditModalOpen(false);
        setEditRoutineText('');
        setRoutineToEdit(null);
        setSelectedDays([]);
    };

    const updateRoutineItem = () => {
        if (!routineToEdit || editRoutineText.trim() === '') {
            alert('루틴을 선택하거나 수정할 루틴 이름이 비어 있습니다.');
            return;
        }

        const updatedRoutine = {
            ...routineToEdit,
            routineName: editRoutineText,
            routineInterval: selectedDays.join(',')
        };

        setPendingRoutines(prev => {
            const updatedRoutines = {
                ...prev,
                [routineToEdit.roomId]: (prev[routineToEdit.roomId] || []).map(routine =>
                    routine.id === updatedRoutine.id ? updatedRoutine : routine
                )
            };
            localStorage.setItem('pendingRoutines', JSON.stringify(updatedRoutines));
            return updatedRoutines;
        });

        closeEditModal();
    };

    const deleteRoutineItem = () => {
        if (!routineToEdit) {
            alert('삭제할 루틴을 선택해주세요.');
            return;
        }

        setPendingRoutines(prev => {
            const updatedRoutines = {
                ...prev,
                [routineToEdit.roomId]: (prev[routineToEdit.roomId] || []).filter(routine => routine.id !== routineToEdit.id)
            };
            localStorage.setItem('pendingRoutines', JSON.stringify(updatedRoutines));
            return updatedRoutines;
        });

        closeEditModal();
    };

    const getFilteredRoutines = (frequency) => {
        return rooms.map(room => {
            const roomRoutines = (pendingRoutines[room.roomId] || []).filter(routine => routine.routineFrequency === frequency);
            return {
                ...room,
                routines: roomRoutines
            };
        });
    };

    const filteredRoutines = getFilteredRoutines('WEEKLY');

    const daysOfWeek = ['월', '화', '수', '목', '금', '토', '일'];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <img
                    className={styles.back}
                    src="/lib/back.svg"
                    alt="back"
                    onClick={() => {
                        clearLocalStorage();
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
                                        <label htmlFor={`routine-${item.id}`} onClick={() => openEditModal(item)}>
                                            {item.routineName}
                                        </label>
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
                        <div className={styles.daysOfWeek}>
                            {daysOfWeek.map((day, index) => (
                                <button
                                    key={day}
                                    className={`${styles.dayButton} ${selectedDays.includes(day) ? styles.selected : ''} ${day === '토' ? styles.saturday : ''} ${day === '일' ? styles.sunday : ''}`}
                                    onClick={() => toggleDaySelection(day)}
                                >
                                    {day}
                                </button>
                            ))}
                        </div>
                        <div className={styles.buttonGroup}>
                            <button onClick={addRoutineItem}>추가</button>
                            <button onClick={closeAddModal}>취소</button>
                        </div>
                    </div>
                </div>
            )}

            {editModalOpen && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h2>루틴 수정</h2>
                        <input
                            type="text"
                            value={editRoutineText}
                            onChange={(e) => setEditRoutineText(e.target.value)}
                        />
                        <div className={styles.daysOfWeek}>
                            {daysOfWeek.map((day) => (
                                <button
                                    key={day}
                                    className={`${styles.dayButton} ${selectedDays.includes(day) ? styles.selected : ''} 
                                    ${day === '토' ? styles.saturday : ''} ${day === '일' ? styles.sunday : ''}`}
                                    onClick={() => toggleDaySelection(day)}
                                >
                                    {day}
                                </button>
                            ))}
                        </div>
                        <div className={styles.buttonGroup}>
                            <button onClick={updateRoutineItem}>수정</button>
                            <button onClick={deleteRoutineItem}>삭제</button>
                            <button onClick={closeEditModal}>취소</button>
                        </div>
                    </div>
                </div>
            )}
            <Footer/>
        </div>
    );
};

export default CreateWeeklyRoutine;
