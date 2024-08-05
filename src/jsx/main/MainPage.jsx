import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../css/main/mainPage.module.css';
import Footer from '../../jsx/fix/Footer.jsx';
import RoomView from '../../jsx/room/RoomView.jsx';
import moment from 'moment-timezone';
import { BACK_URL } from "../../Constraints.js";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBell, faBellSlash, faCheckSquare, faPlus, faSquare} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
const MainPage = () => {

    const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD')); // 기본 날짜를 오늘로 설정
    const [events, setEvents] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [editModalIsOpen, setEditModalIsOpen] = useState(false);
    const [addModalIsOpen, setAddModalIsOpen] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [updatedScheduleName, setUpdatedScheduleName] = useState('');
    const [newScheduleName, setNewScheduleName] = useState('');
    const [selectedRoomId, setSelectedRoomId] = useState(null);
    const [friends, setFriends] = useState([]);
    const [roomIds, setRoomIds] = useState([]);
    const [roomNames, setRoomNames] = useState({});


    const loginUserId = 2; // 로그인한 유저의 ID

    useEffect(() => {
        axios.get(`${BACK_URL}/friend/list`, {
            params: {
                userId: loginUserId
            }
        })
            .then(response => {
                setFriends(response.data);
                console.log(friends);
            })
            .catch(error => {
                console.error('Error fetching friends:', error);
            });
    }, []);


    const fetchRoomData = async () => {
        try {
            const response = await fetch(`${BACK_URL}/room/details`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginUserId)
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const roomData = await response.json();
            setRoomIds(roomData.map(room => room.roomId));
            setRoomNames(roomData.reduce((acc, room) => {
                acc[room.roomId] = room.roomName;
                return acc;
            }, {}));

            const fetchedEvents = roomData.flatMap(room =>
                room.schedules.map(schedule => ({
                    title: schedule.scheduleName,
                    start: schedule.scheduleDate,
                    extendedProps: {
                        roomId: room.roomId,
                        details: schedule.scheduleDetail,
                        scheduleId: schedule.scheduleId,
                        checked: schedule.scheduleIsChecked,
                        alarm: schedule.scheduleIsAlarm
                    }
                }))
            );
            setEvents(fetchedEvents);
        } catch (error) {
            console.error('Error fetching room data:', error);
        }
    };

    useEffect(() => {
        fetchRoomData();
    }, []);

    useEffect(() => {
        const updatedSchedules = roomIds.reduce((acc, roomId) => {
            acc[roomId] = {
                roomName: roomNames[roomId] || 'Unknown Room',
                schedules: events.filter(event =>
                    event.extendedProps.roomId === parseInt(roomId, 10) &&
                    moment(event.start).format('YYYY-MM-DD') === selectedDate
                ).map(event => ({
                    roomId: event.extendedProps.roomId,
                    scheduleId: event.extendedProps.scheduleId,
                    scheduleDetail: event.extendedProps.details,
                    scheduleName: event.title,
                    scheduleIsChecked: event.extendedProps.checked,
                    scheduleIsAlarm: event.extendedProps.alarm
                }))
            };
            return acc;
        }, {});

        setSchedules(updatedSchedules);
    }, [events, selectedDate, roomIds, roomNames]);

    const handleCheckboxChange = async (scheduleId, isChecked) => {
        try {
            const response = await fetch(`${BACK_URL}/calendar/updateChecked/${scheduleId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ checked: isChecked })
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            await fetchRoomData(); // 전체 데이터를 다시 가져옵니다.
        } catch (error) {
            console.error('Error updating schedule checked status:', error);
        }
    };

    const handleCheckboxToggle = (scheduleId, e) => {
        e.stopPropagation();
        const schedule = Object.values(schedules).flatMap(room => room.schedules).find(sch => sch.scheduleId === scheduleId);
        if (schedule) {
            handleCheckboxChange(scheduleId, !schedule.scheduleIsChecked);
        }
    };

    const handleAlarmChange = async (scheduleId, isAlarmed) => {
        try {
            const response = await fetch(`${BACK_URL}/calendar/alarm/${scheduleId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ alarm: isAlarmed })
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            await fetchRoomData(); // 전체 데이터를 다시 가져옵니다.
        } catch (error) {
            console.error('Error updating schedule alarm status:', error);
        }
    };

    const handleAlarmToggle = (scheduleId, e) => {
        e.stopPropagation();
        const schedule = Object.values(schedules).flatMap(room => room.schedules).find(sch => sch.scheduleId === scheduleId);
        if (schedule) {
            handleAlarmChange(scheduleId, !schedule.scheduleIsAlarm);
        }
    };

    const handleScheduleUpdate = async () => {
        try {
            await fetch(`${BACK_URL}/calendar/updateName/${selectedSchedule.scheduleId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ scheduleName: updatedScheduleName })
            });
            fetchRoomData(); // 데이터 새로 고침
            closeEditModal();
        } catch (error) {
            console.error('Error updating schedule name:', error);
        }
    };

    // 일정 삭제 기능
    const handleDelete = (scheduleId) => {
        fetch(`${BACK_URL}/calendar/delete/${scheduleId}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(() => {
                fetchRoomData();
                closeEditModal();
            })
            .catch(error => {
                console.error('스케줄 삭제 도중 오류 발생', error);
            });
    };

    const handleAddSchedule = async () => {

        if (!newScheduleName.trim()) {
            alert("일정 이름을 입력해주세요.");
            return;
        }

        let date;

        if (typeof selectedDate === 'string') {
            let dateParts = selectedDate.split("-");
            date = new Date(Date.UTC(dateParts[0], dateParts[1] - 1, dateParts[2]));
        } else {
            date = new Date(selectedDate);
        }

        if (isNaN(date.getTime())) {
            throw new Error("Invalid date format");
        }

        const isoDate = date.toISOString();


        try {
            await fetch(`${BACK_URL}/calendar/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    scheduleName: newScheduleName,
                    scheduleDate: isoDate,
                    scheduleDetail: "",
                    scheduleIsChecked: false,
                    scheduleIsAlarm: false,
                    roomId: selectedRoomId
                })
            });
            fetchRoomData(); // 데이터 새로 고침
            closeAddModal();
        } catch (error) {
            console.error('Error adding new schedule:', error);
        }
    };


    const openEditModal = (schedule) => {
        setSelectedSchedule(schedule);
        setUpdatedScheduleName(schedule.scheduleName);
        setEditModalIsOpen(true);
    };

    const closeEditModal = () => {
        setEditModalIsOpen(false);
        setSelectedSchedule(null);
    };

    const openAddModal = (roomId) => {
        setNewScheduleName('');
        setSelectedRoomId(roomId);
        setAddModalIsOpen(true);
    };

    const closeAddModal = () => {
        setAddModalIsOpen(false);
    };


    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <div className={styles.friendsContainer}>
                <div className={styles.friendsList}>
                    {friends.map(friend => (
                        <div className={styles.friend} key={friend.userId}
                             onClick={() => navigate(`/friend/friendRoom/${friend.userId}`)}>
                            <img src={`public/lib/${friend.userId}.png`} alt={friend.userId}/>
                            <p>{friend.nickname}</p>
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
                <img src="/lib/왼쪽화살표.svg" alt="왼쪽 화살표" onClick={() => navigate('/main/toilet')}/>
                <div className={styles.roomView}>
                    <RoomView/>
                </div>
                <img src="/lib/오른쪽화살표.svg" alt="오른쪽 화살표" onClick={() => navigate('/main/livingroom')}/>
            </div>
            <div className={styles.guestBook}>
                <p onClick={() => navigate('/main/guestbook')}>방명록</p>
            </div>
            <div className={styles.scheduleList}>
                {Object.keys(schedules).map((roomId, idx) => (
                    // 두 번째 방(PRIVATE)만 렌더링
                    idx === 1 && (
                        <div key={roomId} className={`${styles.roomSection} ${styles[`room-${idx}`]}`}>
                            <h3>{schedules[roomId].roomName}</h3>
                            <ul>
                                {schedules[roomId].schedules.map(schedule => (
                                    <li key={schedule.scheduleId} className={styles.scheduleItem}>
                            <span
                                className={`${styles.checkbox} ${schedule.scheduleIsChecked ? styles.checked : ''}`}
                                onClick={(e) => handleCheckboxToggle(schedule.scheduleId, e)}
                            >
                                <FontAwesomeIcon icon={schedule.scheduleIsChecked ? faCheckSquare : faSquare}/>
                            </span>
                                        <span
                                            className={styles.scheduleName}
                                            onClick={() => openEditModal(schedule)}
                                        >
                                {schedule.scheduleName}
                            </span>
                                        <span
                                            className={`${styles.alarm} ${schedule.scheduleIsAlarm ? styles.alarmed : ''}`}
                                            onClick={(e) => handleAlarmToggle(schedule.scheduleId, e)}
                                        >
                                <FontAwesomeIcon icon={schedule.scheduleIsAlarm ? faBell : faBellSlash}/>
                            </span>
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => openAddModal(parseInt(roomId, 10))} className={styles.addButton}>
                                <FontAwesomeIcon icon={faPlus}/> 일정 추가
                            </button>
                        </div>
                    )
                ))}
            </div>
            {/* Edit and Add Modals */}
            {editModalIsOpen && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h2>일정 수정</h2>
                        <input
                            type="text"
                            value={updatedScheduleName}
                            onChange={(e) => setUpdatedScheduleName(e.target.value)}
                        />
                        <div className={styles.buttonGroup}>
                            <button onClick={handleScheduleUpdate}>저장</button>
                            <button onClick={() => handleDelete(selectedSchedule.scheduleId)}
                                    className={styles.deleteButton}>삭제
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {addModalIsOpen && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h2>일정 추가</h2>
                        <input
                            type="text"
                            value={newScheduleName}
                            onChange={(e) => setNewScheduleName(e.target.value)}
                        />
                        <div className={styles.buttonGroup}>
                            <button onClick={handleAddSchedule}>추가</button>
                            <button onClick={closeAddModal}>취소</button>
                        </div>
                    </div>
                </div>
            )}
            <Footer/>
        </div>
    );
};

export default MainPage;
