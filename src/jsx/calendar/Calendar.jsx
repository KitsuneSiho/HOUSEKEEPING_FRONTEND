import React, { useState, useEffect} from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { BACK_URL } from "../../Constraints.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckSquare, faSquare, faPlus, faBell, faBellSlash } from '@fortawesome/free-solid-svg-icons';
import styles from '../../css/calendar/calendar.module.css'; // 기존 CSS 파일을 사용합니다
import Footer from '../../jsx/fix/Footer.jsx'; // 기존 Footer 컴포넌트를 사용합니다
import moment from 'moment-timezone';

const Calendar = () => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [events, setEvents] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [editModalIsOpen, setEditModalIsOpen] = useState(false);
    const [addModalIsOpen, setAddModalIsOpen] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [updatedScheduleName, setUpdatedScheduleName] = useState('');
    const [newScheduleName, setNewScheduleName] = useState('');
    const [selectedRoomId, setSelectedRoomId] = useState(null);

    // 초기 페이지 로드 시 오늘 날짜의 스케줄을 띄움
    useEffect(() => {
        const today = moment().format('YYYY-MM-DD');
        handleDateClick({ dateStr: today });
    }, []);

    // 날짜 별 스케줄 보여주는 기능
    const handleDateClick = (arg) => {
        setSelectedDate(arg.dateStr);

        const roomIds = JSON.parse(sessionStorage.getItem('roomIds')) || [1, 2, 3];
        const roomNames = JSON.parse(sessionStorage.getItem('roomNames')) || {
            1: '주방',
            2: '내방',
            3: '화장실'
        };

        fetch(`${BACK_URL}/calendar/view`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(roomIds)
        })
            .then(response => response.json())
            .then(data => {
                const fetchedEvents = [];
                for (const roomId in data) {
                    data[roomId].forEach(schedule => {
                        fetchedEvents.push({
                            title: schedule.scheduleName,
                            start: schedule.scheduleDate,
                            extendedProps: {
                                roomId: parseInt(roomId, 10),
                                details: schedule.scheduleDetail,
                                scheduleId: schedule.scheduleId,
                                checked: schedule.scheduleIsChecked,
                                alarm: schedule.scheduleIsAlarm // 알람 상태 추가
                            }
                        });
                    });
                }
                setEvents(fetchedEvents);

                const filteredSchedules = fetchedEvents.filter(event =>
                    moment(event.start).format('YYYY-MM-DD') === arg.dateStr
                ).map(event => ({
                    roomId: event.extendedProps.roomId,
                    scheduleId: event.extendedProps.scheduleId,
                    scheduleDetail: event.extendedProps.details,
                    scheduleName: event.title,
                    scheduleIsChecked: event.extendedProps.checked,
                    scheduleIsAlarm: event.extendedProps.alarm // 알람 상태 추가
                }));

                const groupedSchedules = roomIds.reduce((acc, roomId) => {
                    acc[roomId] = {
                        roomName: roomNames[roomId],
                        schedules: filteredSchedules
                            .filter(schedule => schedule.roomId === parseInt(roomId, 10))
                            .sort((a, b) => a.scheduleName.localeCompare(b.scheduleName))
                    };
                    return acc;
                }, {});

                setSchedules(groupedSchedules);
            })
            .catch(error => {
                console.error('Error fetching schedules:', error);
            });
    };

    // 체크 박스 기능
    const handleCheckboxChange = (scheduleId, isChecked) => {
        // schedules 객체의 모든 스케줄을 평탄화
        const updatedSchedules = Object.keys(schedules).reduce((acc, roomId) => {
            const updatedRoomSchedules = schedules[roomId].schedules.map(sch =>
                sch.scheduleId === scheduleId ? { ...sch, scheduleIsChecked: isChecked } : sch
            );
            acc[roomId] = { ...schedules[roomId], schedules: updatedRoomSchedules };
            return acc;
        }, {});


        setSchedules(updatedSchedules);

        fetch(`${BACK_URL}/calendar/updateChecked/${scheduleId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ checked: isChecked })
        })
            .then(response => response.json())
            .then(data => {
                setEvents(events.map(event =>
                    event.extendedProps.scheduleId === data.scheduleId ?
                        { ...event, extendedProps: { ...event.extendedProps, checked: data.checked } } : event
                ));
            })
            .catch(error => {
                console.error('Error updating schedule checked status:', error);
                setSchedules(schedules.map(room => ({
                    ...room,
                    schedules: room.schedules.map(sch =>
                        sch.scheduleId === scheduleId ?
                            { ...sch, scheduleIsChecked: !isChecked } : sch
                    )
                })));
            });
    };

    // 체크 박스 기능
    const handleCheckboxToggle = (scheduleId, e) => {
        e.stopPropagation();
        const schedule = Object.values(schedules).flatMap(room => room.schedules).find(sch => sch.scheduleId === scheduleId);
        if (schedule) {
            handleCheckboxChange(scheduleId, !schedule.scheduleIsChecked);
        }
    };

    // 알람 기능
    const handleAlarmChange = (scheduleId, isAlarmed) => {
        // schedules 객체의 모든 스케줄을 평탄화
        const updatedSchedules = Object.keys(schedules).reduce((acc, roomId) => {
            const updatedRoomSchedules = schedules[roomId].schedules.map(sch =>
                sch.scheduleId === scheduleId ? { ...sch, scheduleIsAlarm: isAlarmed } : sch
            );
            acc[roomId] = { ...schedules[roomId], schedules: updatedRoomSchedules };
            return acc;
        }, {});


        setSchedules(updatedSchedules);

        console.log(scheduleId);
        console.log(isAlarmed);

        fetch(`${BACK_URL}/calendar/alarm/${scheduleId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ alarm: isAlarmed })
        })
            .then(response => response.json())
            .then(data => {
                setEvents(events.map(event =>
                    event.extendedProps.scheduleId === data.scheduleId ?
                        { ...event, extendedProps: { ...event.extendedProps, alarm: data.alarm } } : event
                ));
            })
            .catch(error => {
                console.error('Error updating schedule alarm status:', error);
                setSchedules(schedules.map(room => ({
                    ...room,
                    schedules: room.schedules.map(sch =>
                        sch.scheduleId === scheduleId ?
                            { ...sch, scheduleIsAlarm: !isAlarmed } : sch
                    )
                })));
            });
    };

    // 알람 기능
    const handleAlarmToggle = (scheduleId, e) => {
        e.stopPropagation();
        const schedule = Object.values(schedules).flatMap(room => room.schedules).find(sch => sch.scheduleId === scheduleId);
        if (schedule) {
            handleAlarmChange(scheduleId, !schedule.scheduleIsAlarm);
        }
    };

    // 일정 이름 수정 기능
    const handleScheduleUpdate = () => {
        fetch(`${BACK_URL}/calendar/updateName/${selectedSchedule.scheduleId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ scheduleName: updatedScheduleName })
        })
            .then(response => response.json())
            .then(() => {
                handleDateClick({ dateStr: selectedDate });
                closeEditModal();
            })
            .catch(error => {
                console.error('Error updating schedule name:', error);
            });
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
                handleDateClick({ dateStr: selectedDate });
                closeEditModal();
            })
            .catch(error => {
                console.error('스케줄 삭제 도중 오류 발생', error);
            });
    };

    // 일정 추가 기능
    const handleAddSchedule = () => {
        console.log("selectedDate:", selectedDate);
        console.log("Type of selectedDate:", typeof selectedDate);

        let date;
        try {
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

            const newSchedule = {
                scheduleName: newScheduleName,
                scheduleDate: isoDate,
                scheduleDetail: "",
                scheduleIsChecked: false,
                scheduleIsAlarm: false, // 알람 기본값 설정
                roomId: selectedRoomId,
            };

            fetch(`${BACK_URL}/calendar/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newSchedule)
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(() => {
                    handleDateClick({ dateStr: selectedDate });
                    closeAddModal();
                })
                .catch(error => {
                    console.error('Error adding new schedule:', error);
                });
        } catch (error) {
            console.error('Error processing date:', error);
        }
    };

    const closeEditModal = () => {
        setEditModalIsOpen(false);
        setSelectedSchedule(null);
        setUpdatedScheduleName('');
    };

    const closeAddModal = () => {
        setAddModalIsOpen(false);
    };


    const openEditModal = (schedule, e) => {
        e.stopPropagation();
        setSelectedSchedule(schedule);
        setUpdatedScheduleName(schedule.scheduleName);
        setEditModalIsOpen(true);
    };

    const openAddModal = (roomId) => {
        setNewScheduleName('');
        setSelectedRoomId(roomId); // 추가된 부분
        setAddModalIsOpen(true);
        console.log(roomId);
    };

    return (
        <div className={styles.container}>
            <div className={styles.calendarHeader}>
                <img src="/lib/back.svg" alt="back"/>
                <h2>2024년 7월</h2>
                <img src="/lib/front.svg" alt="forward"/>
            </div>
            <div className={styles.calendar}>
                <FullCalendar
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    dateClick={handleDateClick}
                    aspectRatio={1.1}
                />
            </div>
            <div className="list-modal">
                <div className="modal-header">
                    <h2>{selectedDate}</h2>
                </div>
                <div className="modal-content">
                    {Object.keys(schedules).length > 0 ? (
                        Object.keys(schedules).map((roomId, idx) => (
                            <div key={roomId} className={`room-section room-${idx}`}>
                                <h3>{schedules[roomId].roomName}</h3>
                                <ul className="routine-list">
                                    {schedules[roomId].schedules.map(schedule => (
                                        <li key={schedule.scheduleId} className="schedule-item">
                                            <FontAwesomeIcon
                                                icon={schedule.scheduleIsChecked ? faCheckSquare : faSquare}
                                                onClick={(e) => handleCheckboxToggle(schedule.scheduleId, e)}
                                                className="checkbox-icon"
                                            />
                                            <label
                                                className="schedule-label"
                                                onClick={(e) => openEditModal(schedule, e)}
                                            >
                                                {schedule.scheduleName}
                                            </label>
                                            <FontAwesomeIcon
                                                icon={schedule.scheduleIsAlarm ? faBell : faBellSlash}
                                                onClick={(e) => handleAlarmToggle(schedule.scheduleId, e)}
                                                className="alarm-icon"
                                            />
                                        </li>
                                    ))}
                                    <button className="add-schedule-button" onClick={() => openAddModal(roomId)}>
                                        <FontAwesomeIcon icon={faPlus}/> 일정 추가
                                    </button>
                                </ul>
                            </div>
                        ))
                    ) : (
                        <p>No schedules available.</p>
                    )}
                </div>
            </div>

            {editModalIsOpen && (
                <>
                    <div className="modal-overlay" onClick={closeEditModal}></div>
                    <div className="edit-modal">
                        <div className="edit-modal-header">
                            <h2>일정 수정</h2>
                            <button onClick={closeEditModal} className="close-button">닫기</button>
                        </div>
                        <div className="edit-modal-content">
                            <label htmlFor="scheduleName">일정 이름 </label>
                            <input
                                id="scheduleName"
                                value={updatedScheduleName}
                                onChange={(e) => setUpdatedScheduleName(e.target.value)}
                            />
                            <button onClick={handleScheduleUpdate} className="save-button">Save</button>
                            <button onClick={() => handleDelete(selectedSchedule.scheduleId)}
                                    className="delete-button">Delete
                            </button>
                        </div>
                    </div>
                </>
            )}
            {addModalIsOpen && (
                <>
                    <div className="modal-overlay" onClick={closeAddModal}></div>
                    <div className="edit-modal">
                        <div className="edit-modal-header">
                            <h2>일정 추가</h2>
                            <button onClick={closeAddModal} className="close-button">닫기</button>
                        </div>
                        <div className="edit-modal-content">
                            <label htmlFor="newScheduleName"></label>
                            <input
                                id="newScheduleName"
                                value={newScheduleName}
                                onChange={(e) => setNewScheduleName(e.target.value)}
                            />
                            <button onClick={handleAddSchedule}>추가</button>
                        </div>
                    </div>
                </>
            )}
            <Footer/>
        </div>
    );
};

export default Calendar;
