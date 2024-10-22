import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { BACK_URL } from "../../Constraints.js";
import styles from '../../css/calendar/calendar.module.css';
import Footer from '../../jsx/fix/Footer.jsx';
import moment from 'moment-timezone';
import '../../css/calendar/customCalendar.css'; // 커스텀 CSS 파일을 import
import axiosInstance from "../../config/axiosInstance.js";
import {useLogin} from "../../contexts/AuthContext.jsx";

const Calendar = () => {

    const {user} = useLogin();
    const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));
    const [events, setEvents] = useState([]);
    const [schedules, setSchedules] = useState({});
    const [editModalIsOpen, setEditModalIsOpen] = useState(false);
    const [addModalIsOpen, setAddModalIsOpen] = useState(false);
    const [editRoomNameModalIsOpen, setEditRoomNameModalIsOpen] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [updatedScheduleName, setUpdatedScheduleName] = useState('');
    const [newScheduleName, setNewScheduleName] = useState('');
    const [selectedRoomId, setSelectedRoomId] = useState(null);
    const [roomIds, setRoomIds] = useState([]);
    const [roomNames, setRoomNames] = useState({});
    const [selectedRoom, setSelectedRoom] = useState({ roomId: null, roomName: '' });
    const [updatedRoomName, setUpdatedRoomName] = useState('');


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

    const handleDateClick = (arg) => {
        setSelectedDate(moment(arg.dateStr).format('YYYY-MM-DD'));
    };

    const handleCheckboxChange = async (scheduleId, isChecked) => {
        try {
            await axiosInstance.patch(`/calendar/updateChecked/${scheduleId}`, { checked: isChecked });
            await fetchRoomData();
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
            await axiosInstance.patch(`/calendar/alarm/${scheduleId}`, { alarm: isAlarmed });
            await fetchRoomData();
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
            await axiosInstance.patch(`/calendar/updateName/${selectedSchedule.scheduleId}`, { scheduleName: updatedScheduleName });
            fetchRoomData();
            closeEditModal();
        } catch (error) {
            console.error('Error updating schedule name:', error);
        }
    };


    const handleDelete = async (scheduleId) => {
        try {
            await axiosInstance.delete(`/calendar/delete/${scheduleId}`);
            fetchRoomData();
            closeEditModal();
        } catch (error) {
            console.error('Error deleting schedule:', error);
        }
    };

    // 방 이름 변경
    const handleRoomNameUpdate = async () => {
        try {
            await axiosInstance.post(`/room/rename`, new URLSearchParams({
                roomId: selectedRoom.roomId,
                newName: updatedRoomName
            }));

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
            fetchRoomData();
            closeAddModal();
        } catch (error) {
            console.error('Error adding new schedule:', error);
        }
    };

    const dayCellClassNames = (info) => {
        return moment(info.date).format('YYYY-MM-DD') === selectedDate ? [styles.selectedDate] : [];
    };

    const getBackgroundColor = (index) => {
        const colors = ['#ffc5f2', '#ffebc5', '#c5f1ff'];
        return colors[index % colors.length] || '#ffffff';
    };

    const getCheckboxImage = (isChecked, roomIndex) => {
        const images = [
            { checked: "/lib/내방체크on.svg", unchecked: "/lib/내방체크off.svg" },
            { checked: "/lib/주방체크on.svg", unchecked: "/lib/주방체크off.svg" },
            { checked: "/lib/화장실체크on.svg", unchecked: "/lib/화장실체크off.svg" }
        ];

        const typeImages = images[roomIndex % images.length];
        return isChecked ? typeImages.checked : typeImages.unchecked;
    };

    const getAddButtonBackgroundColor = (index) => {
        const colors = ['#ffc5f2', '#ffebc5', '#c5f1ff'];
        return colors[index % colors.length] || '#ffffff';
    };

    return (
        <div className={styles.container}>
            <div className={styles.fullCalendarContainer}>
                <FullCalendar
                    aspectRatio={0.8}
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    dateClick={handleDateClick}
                    eventClick={(info) => {
                        const schedule = info.event.extendedProps;
                        openEditModal({
                            scheduleId: schedule.scheduleId,
                            scheduleName: info.event.title,
                            scheduleDetail: schedule.details,
                            scheduleIsChecked: schedule.checked,
                            scheduleIsAlarm: schedule.alarm
                        });
                    }}
                    dayCellClassNames={dayCellClassNames}
                />
            </div>
            <div className={styles.scheduleList}>
                {Object.keys(schedules).map((roomId, index) => (
                    <div
                        key={roomId}
                        className={styles.roomSection}
                    >
                        <div
                            className={styles.roomHeader}
                            style={{
                                backgroundColor: getBackgroundColor(index),
                                color: '#000'
                            }}
                        >
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
                                        <img src={getCheckboxImage(schedule.scheduleIsChecked, index)} alt="check"/>
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
                                        <img src={schedule.scheduleIsAlarm ? "/lib/알림on.svg" : "/lib/알림off.svg"}
                                             alt="alarm"/>
                                    </span>
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={() => openAddModal(parseInt(roomId, 10))}
                            className={styles.addButton}
                            style={{
                                backgroundColor: getAddButtonBackgroundColor(index),
                                color: '#000'
                            }}
                        >
                            <img src="/lib/plus.svg" alt="add"/> 일정 추가
                        </button>
                    </div>
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

export default Calendar;
