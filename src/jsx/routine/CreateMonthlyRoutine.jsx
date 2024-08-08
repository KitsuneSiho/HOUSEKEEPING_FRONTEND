import React, { useState, useEffect } from 'react';
import styles from '../../css/routine/monthlyRoutineInfo.module.css';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Footer from '../../jsx/fix/Footer.jsx';
import { BACK_URL } from '../../Constraints.js';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const CreateMonthlyRoutine = () => {
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
    const [selectedDates, setSelectedDates] = useState([]);
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

    const toggleDateSelection = (date) => {
        setSelectedDates(prev =>
            prev.includes(date) ? prev.filter(d => d !== date) : [...prev, date]
        );
    };

    const addRoutineItem = () => {
        if (selectedRoomId === null || newRoutineText.trim() === '' || selectedDates.length === 0) {
            alert('방 ID, 루틴 이름, 그리고 적어도 하나의 날짜를 선택해야 합니다.');
            return;
        }

        const newRoutine = {
            id: uuidv4(),
            routineName: newRoutineText,
            routineGroupName: groupName,
            roomId: selectedRoomId,
            routineInterval: selectedDates.join(','), // 선택된 날짜를 문자열로 저장
            routineFrequency: 'MONTHLY',
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
        setSelectedDates([]); // 날짜 선택 초기화
    };

    const openEditModal = (routine) => {
        setRoutineToEdit(routine);
        setEditRoutineText(routine.routineName);
        setSelectedDates(routine.routineInterval.split(','));
        setEditModalOpen(true);
    };

    const closeEditModal = () => {
        setEditModalOpen(false);
        setEditRoutineText('');
        setRoutineToEdit(null);
        setSelectedDates([]); // 날짜 선택 초기화
    };

    const updateRoutineItem = () => {
        if (!routineToEdit || editRoutineText.trim() === '') {
            alert('루틴을 선택하거나 수정할 루틴 이름이 비어 있습니다.');
            return;
        }

        const updatedRoutine = {
            ...routineToEdit,
            routineName: editRoutineText,
            routineInterval: selectedDates.join(',')
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

    const filteredRoutines = getFilteredRoutines('MONTHLY');

    const daysOfMonth = Array.from({ length: 31 }, (_, i) => i + 1); // 1부터 31까지의 날짜 배열

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
                        <div className={styles.daysOfMonth}>
                            {daysOfMonth.map(date => (
                                <button
                                    key={date}
                                    className={`${styles.dateButton} ${selectedDates.includes(date.toString()) ? styles.selected : ''}`}
                                    onClick={() => toggleDateSelection(date.toString())}
                                >
                                    {date}
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
                        <div className={styles.daysOfMonth}>
                            {daysOfMonth.map((day) => (
                                <button
                                    key={day}
                                    className={`${styles.dateButton} ${selectedDates.includes(day.toString()) ? styles.selected : ''}`}
                                    onClick={() => toggleDateSelection(day.toString())}
                                >
                                    {day}
                                </button>
                            ))}
                        </div>
                        <div className={styles.buttonGroup}>
                            <button onClick={updateRoutineItem}>수정</button>
                            <button onClick={closeEditModal}>취소</button>
                            <button onClick={deleteRoutineItem} className={styles.deleteButton}>삭제</button>
                        </div>
                    </div>
                </div>
            )}
            <Footer/>
        </div>
    );
};

export default CreateMonthlyRoutine;
