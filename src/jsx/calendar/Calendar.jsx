import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { BACK_URL } from "../../Constraints.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckSquare, faSquare, faPlus, faBell, faBellSlash } from '@fortawesome/free-solid-svg-icons';
import styles from '../../css/calendar/calendar.module.css';
import Footer from '../../jsx/fix/Footer.jsx';
import moment from 'moment-timezone';

const Calendar = () => {
    const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD')); // 기본 날짜를 오늘로 설정
    const [events, setEvents] = useState([]);
    const [schedules, setSchedules] = useState({});
    const [editModalIsOpen, setEditModalIsOpen] = useState(false);
    const [addModalIsOpen, setAddModalIsOpen] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [updatedScheduleName, setUpdatedScheduleName] = useState('');
    const [newScheduleName, setNewScheduleName] = useState('');
    const [selectedRoomId, setSelectedRoomId] = useState(null);
    const [roomIds, setRoomIds] = useState([]);
    const [roomNames, setRoomNames] = useState({});

    const loginUserId = 2; // 로그인한 유저의 ID

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

    const handleDateClick = (arg) => {
        setSelectedDate(moment(arg.dateStr).format('YYYY-MM-DD')); // 정확한 날짜를 설정합니다.
    };


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

    const dayCellClassNames = (info) => {
        return moment(info.date).format('YYYY-MM-DD') === selectedDate ? [styles.selectedDate] : [];
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
                    dayCellClassNames={dayCellClassNames} // 날짜 셀에 클래스 이름 추가
                />
            </div>
            <div className={styles.scheduleList}>
                {Object.keys(schedules).map((roomId, idx) => (
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
                            <button onClick={() => handleDelete(selectedSchedule.scheduleId)} className={styles.deleteButton}>삭제</button>
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
            <Footer />
        </div>
    );
};

export default Calendar;