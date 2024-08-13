import React, { useState, useEffect } from 'react';
import styles from '../../css/routine/weeklyRoutineInfo.module.css';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Footer from '../../jsx/fix/Footer.jsx';
import { BACK_URL } from '../../Constraints.js';
import axios from 'axios';
import {useLogin} from "../../contexts/AuthContext.jsx";
import axiosInstance from "../../config/axiosInstance.js";

const WeeklyRoutineInfo = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { groupName } = useParams();
    const [rooms, setRooms] = useState([]);
    const [routineItems, setRoutineItems] = useState({});
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [newRoutineText, setNewRoutineText] = useState('');
    const [editRoutineText, setEditRoutineText] = useState('');
    const [selectedRoomId, setSelectedRoomId] = useState(null);
    const [selectedDays, setSelectedDays] = useState([]); // 선택된 요일
    const [routineToEdit, setRoutineToEdit] = useState(null); // Routine to edit

    const { user } = useLogin();

    const toggleDaySelection = (day) => {
        setSelectedDays((prev) =>
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
        );
    };

    // 그룹 이름으로 루틴 정보 가져오기
    const fetchWeeklyRoutines = async () => {
        try {
            const response = await axiosInstance.get(`/routine/group/${groupName}`);
            const weeklyRoutines = response.data.filter(routine => routine.routineFrequency === 'WEEKLY')
                .reduce((acc, routine) => {
                    if (!acc[routine.roomId]) {
                        acc[routine.roomId] = [];
                    }
                    acc[routine.roomId].push({
                        id: routine.routineId,
                        text: routine.routineName,
                        notification: routine.routineIsAlarm ? 'on' : 'off',
                        routineInterval: routine.routineInterval.split(',') // 요일 정보를 배열로 저장
                    });
                    return acc;
                }, {});
            setRoutineItems(weeklyRoutines);
        } catch (error) {
            console.error('Error fetching weekly routines:', error);
        }
    };

    useEffect(() => {
        // 모든 방 정보 가져오기
        const fetchRooms = async () => {
            try {
                const response = await axiosInstance.get(`/room/list`, {
                    params: { userId: user.userId }
                });
                setRooms(response.data);
            } catch (error) {
                console.error('Error fetching rooms:', error);
            }
        };

        fetchRooms();
        fetchWeeklyRoutines();
    }, [groupName]);

    const addRoutineItem = async () => {
        if (selectedRoomId === null || newRoutineText.trim() === '') {
            alert('방 ID가 없거나 새로운 루틴 이름이 비어 있습니다.');
            return;
        }

        const newRoutine = {
            routineName: newRoutineText,
            routineGroupName: groupName,
            roomId: selectedRoomId,
            routineInterval: selectedDays.join(','),
            routineFrequency: 'WEEKLY',
            routineIsAlarm: false,
            routineIsChecked: false
        };

        try {
            const response = await axiosInstance.post(`/routine/add`, newRoutine);

            if (response.status === 200) {
                const addedRoutine = response.data;
                setRoutineItems(prevItems => ({
                    ...prevItems,
                    [selectedRoomId]: [
                        ...(prevItems[selectedRoomId] || []),
                        {
                            id: addedRoutine.routineId,
                            text: addedRoutine.routineName,
                            notification: addedRoutine.routineIsAlarm ? 'on' : 'off',
                            routineInterval: newRoutine.routineInterval.split(',')
                        }
                    ]
                }));
                closeAddModal();
                fetchWeeklyRoutines();
            } else {
                throw new Error('Failed to add routine item');
            }
        } catch (error) {
            console.error('Error adding routine item:', error);
            alert('일정 추가 중 오류가 발생했습니다.');
        }
    };

    const updateRoutineItem = async () => {
        if (!routineToEdit || editRoutineText.trim() === '') {
            alert('루틴 ID가 없거나 새로운 루틴 이름이 비어 있습니다.');
            return;
        }

        const updatedRoutine = {
            routineId: routineToEdit.id,
            routineName: editRoutineText,
            routineGroupName: groupName,
            roomId: routineToEdit.roomId,
            routineInterval: selectedDays.join(','), // 수정된 요일 정보
            routineFrequency: 'WEEKLY',
            routineIsAlarm: routineToEdit.notification === 'on',
            routineIsChecked: routineToEdit.routineIsChecked
        };

        try {
            const response = await axiosInstance.put(`/routine/update`, updatedRoutine);

            if (response.status === 200) {
                const updatedRoutineData = response.data;
                setRoutineItems(prevItems => ({
                    ...prevItems,
                    [routineToEdit.roomId]: (prevItems[routineToEdit.roomId] || []).map(item =>
                        item.id === updatedRoutineData.routineId ? {
                            ...item,
                            text: updatedRoutineData.routineName,
                            notification: updatedRoutineData.routineIsAlarm ? 'on' : 'off',
                            routineInterval: updatedRoutineData.routineInterval.split(',')
                        } : item
                    )
                }));
                closeEditModal();
                fetchWeeklyRoutines();
            } else {
                throw new Error('Failed to update routine item');
            }
        } catch (error) {
            console.error('Error updating routine item:', error);
            alert('일정 수정 중 오류가 발생했습니다.');
        }
    };

    const deleteRoutineItem = async () => {
        if (!routineToEdit) {
            alert('삭제할 루틴을 선택해주세요.');
            return;
        }

        try {
            const response = await axiosInstance.delete(`/routine/delete/${routineToEdit.id}`);

            if (response.status === 200) {
                setRoutineItems(prevItems => ({
                    ...prevItems,
                    [routineToEdit.roomId]: (prevItems[routineToEdit.roomId] || []).filter(item => item.id !== routineToEdit.id)
                }));
                closeEditModal();
                fetchWeeklyRoutines();
            } else {
                throw new Error('Failed to delete routine item');
            }
        } catch (error) {
            console.error('Error deleting routine item:', error);
            alert('일정 삭제 중 오류가 발생했습니다.');
        }
    };

    const deleteRoutineGroup = async () => {
        if (!window.confirm('이 루틴 그룹을 정말로 삭제하시겠습니까?')) {
            return;
        }

        try {
            const response = await axiosInstance.delete(`/routine/deleteGroup/${groupName}`);
            if (response.status === 200) {
                alert('루틴 그룹이 성공적으로 삭제되었습니다.');
                navigate('/routine'); // 루틴 페이지로 이동하거나 다른 적절한 페이지로 이동
            } else {
                throw new Error('Failed to delete routine group');
            }
        } catch (error) {
            console.error('Error deleting routine group:', error);
            alert('루틴 그룹 삭제 중 오류가 발생했습니다.');
        }
    };

    const handleTabClick = (frequency) => {
        navigate(`/routine/${frequency}/${groupName}`);
    };

    const openAddModal = (roomId) => {
        setSelectedRoomId(roomId);
        setAddModalOpen(true);
    };

    const closeAddModal = () => {
        setAddModalOpen(false);
        setNewRoutineText('');
        setSelectedRoomId(null);
        setSelectedDays([]); // 요일 선택 초기화
    };

    const openEditModal = (routine) => {
        setRoutineToEdit(routine);
        setEditRoutineText(routine.text);

        const intervals = typeof routine.routineInterval === 'string'
            ? routine.routineInterval.split(',')
            : routine.routineInterval || [];

        setSelectedDays(intervals); // 기존 요일 정보 설정
        setEditModalOpen(true);
    };

    const closeEditModal = () => {
        setEditModalOpen(false);
        setEditRoutineText('');
        setRoutineToEdit(null);
        setSelectedDays([]); // 요일 선택 초기화
    };

    const daysOfWeek = ['월', '화', '수', '목', '금', '토', '일'];

    const getAddButtonBackgroundColor = (index) => {
        const colors = ['#ffc5f2', '#ffebc5', '#c5f1ff'];
        return colors[index % colors.length] || '#ffffff';
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <img className={styles.back} src="/lib/back.svg" alt="back" onClick={() => navigate('/routine')}/>
                <h2>{groupName}</h2>
                <h3 onClick={deleteRoutineGroup}>루틴 삭제</h3>
            </div>
            <div className={styles.tabs}>
                <div
                    className={`${styles.tab} ${location.pathname.includes('/routine/daily') ? styles.active : ''}`}
                    onClick={() => handleTabClick('daily')}
                >
                    일간
                </div>
                <div
                    className={`${styles.tab} ${location.pathname.includes('/routine/weekly') ? styles.active : ''}`}
                    onClick={() => handleTabClick('weekly')}
                >
                    주간
                </div>
                <div
                    className={`${styles.tab} ${location.pathname.includes('/routine/monthly') ? styles.active : ''}`}
                    onClick={() => handleTabClick('monthly')}
                >
                    월간
                </div>
            </div>
            <div className={styles.routineContainer}>
                {rooms.map((room, index) => (
                    <div key={room.roomId} className={styles.roomRoutine}>
                        <div className={styles.roomRoutineHeader}>
                            <div className={styles.roomRoutineTitle}
                                 style={{
                                     backgroundColor: getAddButtonBackgroundColor(index),
                                     color: '#000'
                                 }}>
                                <p>{room.roomName}</p>
                                <img src="/lib/연필.svg" alt="edit"/>
                            </div>
                            <div className={styles.alramOnOff}>
                                <p>모든 알림 켜기</p>
                                <img src="/lib/plus.svg" alt="plus" className={styles.plusIcon}
                                     onClick={() => openAddModal(room.roomId)}/>
                            </div>
                        </div>
                        <div className={styles.roomRoutineInfo}>
                            <ul>
                                {(routineItems[room.roomId] || []).map(item => (
                                    <li key={item.id}>
                                        <label htmlFor={`routine-${item.id}`} onClick={() => openEditModal(item)}>
                                            {item.text}
                                        </label>
                                        <img src={`/lib/알림${item.notification}.svg`}
                                             alt={`notification ${item.notification}`}/>
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
                                    className={`${styles.dayButton} ${selectedDays.includes(day) ? styles.selected : ''}`}
                                    onClick={() => toggleDaySelection(day)}
                                >
                                    {day}
                                </button>
                            ))}
                        </div>
                        <div className={styles.buttonGroup}>
                            <button onClick={updateRoutineItem}>수정</button>
                            <button onClick={deleteRoutineItem} className={styles.deleteButton}>삭제</button>
                            <button onClick={closeEditModal}>취소</button>
                        </div>
                    </div>
                </div>
            )}
            <Footer/>
        </div>
    );
};

export default WeeklyRoutineInfo;
