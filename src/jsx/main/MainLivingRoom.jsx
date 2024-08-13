import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../css/main/mainLivingRoom.module.css';
import Footer from '../../jsx/fix/Footer.jsx';
import RoomView from '../../jsx/room/RoomView.jsx';
import axios from "axios";
import {BACK_URL} from "../../Constraints.js";
import moment from "moment-timezone";
import PullutionBar from "../../components/test/PollutionBar.jsx";
import {useLogin} from "../../contexts/AuthContext.jsx";
import axiosInstance from "../../config/axiosInstance.js";

const MainToiletRoom = () => {

    const {user} = useLogin();
    const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD')); // 기본 날짜를 오늘로 설정
    const [events, setEvents] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [editModalIsOpen, setEditModalIsOpen] = useState(false);
    const [addModalIsOpen, setAddModalIsOpen] = useState(false);
    const [editRoomNameModalIsOpen, setEditRoomNameModalIsOpen] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [updatedScheduleName, setUpdatedScheduleName] = useState('');
    const [newScheduleName, setNewScheduleName] = useState('');
    const [selectedRoomId, setSelectedRoomId] = useState(null);
    const [friends, setFriends] = useState([]);
    const [roomIds, setRoomIds] = useState([]);
    const [roomNames, setRoomNames] = useState({});
    const [selectedRoom, setSelectedRoom] = useState({ roomId: null, roomName: '' });
    const [updatedRoomName, setUpdatedRoomName] = useState('');

    const navigate = useNavigate();

    useEffect(() => {

        console.log(user.userId);

        axiosInstance.get(`/friend/list`, {
            params: {
                userId: user.userId
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
            const response = await axiosInstance.post(`/room/details`, user.userId, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const roomData = response.data;
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
            await axiosInstance.patch(`/calendar/updateChecked/${scheduleId}`, {
                checked: isChecked
            });
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
            await axiosInstance.patch(`/calendar/alarm/${scheduleId}`, {
                alarm: isAlarmed
            });
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
            await axiosInstance.patch(`/calendar/updateName/${selectedSchedule.scheduleId}`, {
                scheduleName: updatedScheduleName
            });
            fetchRoomData(); // 데이터 새로 고침
            closeEditModal();
        } catch (error) {
            console.error('Error updating schedule name:', error);
        }
    };

    // 일정 삭제 기능
    const handleDelete = async (scheduleId) => {
        try {
            await axiosInstance.delete(`/calendar/delete/${scheduleId}`);
            fetchRoomData();
            closeEditModal();
        } catch (error) {
            console.error('스케줄 삭제 도중 오류 발생', error);
        }
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
            await axiosInstance.post(`/calendar/add`, {
                scheduleName: newScheduleName,
                scheduleDate: isoDate,
                scheduleDetail: "",
                scheduleIsChecked: false,
                scheduleIsAlarm: false,
                roomId: selectedRoomId
            });
            fetchRoomData(); // 데이터 새로 고침
            closeAddModal();
        } catch (error) {
            console.error('Error adding new schedule:', error);
        }
    };


    // 방 이름 변경
    const handleRoomNameUpdate = async () => {
        try {
            await axiosInstance.post(`/room/rename`, new URLSearchParams({
                roomId: selectedRoom.roomId,
                newName: updatedRoomName
            }), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            fetchRoomData(); // 업데이트된 데이터를 다시 가져옵니다.
            closeEditRoomNameModal();
        } catch (error) {
            console.error('Error updating room name:', error);
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

    const openEditRoomNameModal = (roomId, roomName) => {
        setSelectedRoom({ roomId, roomName });
        setUpdatedRoomName(roomName);
        setEditRoomNameModalIsOpen(true);
    };

    const closeEditRoomNameModal = () => {
        setEditRoomNameModalIsOpen(false);
        setSelectedRoom({ roomId: null, roomName: '' });
        setUpdatedRoomName('');
    };


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
                <PullutionBar pollution={0}/>
            </div>
            <div className={styles.roomDesign}>
                <img src="/lib/왼쪽화살표.svg" alt="왼쪽 화살표" onClick={() => navigate('/main')}/>
                <div className={styles.roomView}>
                    <RoomView/>
                </div>
                <img src="/lib/오른쪽화살표.svg" alt="오른쪽 화살표" onClick={() => navigate('/main/toilet')}/>
            </div>
            <div className={styles.guestBook}>
                <p onClick={() => navigate('/main/guestbook')}>방명록</p>
            </div>
            <div className={styles.scheduleList}>
                {Object.keys(schedules).map((roomId, idx) => (
                    // 두 번째 방(KITCHEN)만 렌더링
                    idx === 1 && (
                        <div key={roomId} className={`${styles.roomSection} ${styles[`room-${idx}`]}`}>
                            <div className={styles.roomSectionTitle}>
                                <h3>{schedules[roomId].roomName}</h3>
                                <img src="/lib/연필.svg" alt="연필"
                                     onClick={() => openEditRoomNameModal(roomId, roomNames[roomId])}/>
                            </div>
                            <ul>
                                {schedules[roomId].schedules.map(schedule => (
                                    <li key={schedule.scheduleId} className={styles.scheduleItem}>
                                        <span
                                            className={`${styles.checkbox} ${schedule.scheduleIsChecked ? styles.checked : ''}`}
                                            onClick={(e) => handleCheckboxToggle(schedule.scheduleId, e)}
                                        >
                                            <img src={schedule.scheduleIsChecked ? "/lib/주방체크on.svg" : "/lib/주방체크off.svg"} alt="check"/>
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
                                            <img src={schedule.scheduleIsAlarm ? "/lib/알림on.svg" : "/lib/알림off.svg"} alt="alarm"/>
                                        </span>
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => openAddModal(parseInt(roomId, 10))} className={styles.addButton}>
                                <img src="/lib/plus.svg" alt="add"/> 일정 추가
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
            {editRoomNameModalIsOpen && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h2>방 이름 수정</h2>
                        <input
                            type="text"
                            value={updatedRoomName}
                            onChange={(e) => setUpdatedRoomName(e.target.value)}
                        />
                        <div className={styles.buttonGroup}>
                            <button onClick={handleRoomNameUpdate}>저장</button>
                            <button onClick={closeEditRoomNameModal}>취소</button>
                        </div>
                    </div>
                </div>
            )}
            <Footer/>
        </div>
    );
};

export default MainToiletRoom;
