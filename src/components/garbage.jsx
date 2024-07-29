import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { BACK_URL } from "../Constraints.js";
import './Calendar.css';
import moment from 'moment-timezone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckSquare, faSquare, faPlus } from '@fortawesome/free-solid-svg-icons';

const Calendar = () => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [events, setEvents] = useState([]);
    const [schedules, setSchedules] = useState([]); // 모달에 표시할 스케줄
    const [editModalIsOpen, setEditModalIsOpen] = useState(false);
    const [addModalIsOpen, setAddModalIsOpen] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [updatedScheduleName, setUpdatedScheduleName] = useState('');
    const [newScheduleName, setNewScheduleName] = useState('');
    const [newScheduleDetail, setNewScheduleDetail] = useState('');
    const [roomNames, setRoomNames] = useState({}); // 방 이름 상태

    useEffect(() => {
        // 세션에서 방 아이디와 이름을 가져옵니다.
        const roomIds = JSON.parse(sessionStorage.getItem('roomIds')) || [1, 2, 3];
        const roomNamesFromSession = JSON.parse(sessionStorage.getItem('roomNames')) || {
            1: '주방',
            2: '내방',
            3: '화장실'
        };

        setRoomNames(roomNamesFromSession);

        // 서버에서 스케줄 데이터를 가져옵니다.
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

                // 서버에서 받은 데이터를 기반으로 이벤트를 생성합니다.
                for (const roomId in data) {
                    data[roomId].forEach(schedule => {
                        fetchedEvents.push({
                            title: schedule.scheduleName,
                            start: new Date(schedule.scheduleDate).toISOString(), // 날짜 형식을 ISO 문자열로 변환
                            extendedProps: {
                                roomId: parseInt(roomId, 10), // roomId를 숫자로 변환
                                details: schedule.scheduleDetail,
                                scheduleId: schedule.scheduleId,
                                checked: schedule.scheduleIsChecked
                            }
                        });
                    });
                }

                // 이벤트 상태를 업데이트합니다.
                setEvents(fetchedEvents);
            })
            .catch(error => {
                console.error('Error fetching schedules:', error);
            });
    }, []);

    const handleDateClick = (arg) => {
        setSelectedDate(arg.dateStr);

        // Fetch the latest schedules for the selected date
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
                                checked: schedule.scheduleIsChecked
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
                    scheduleIsChecked: event.extendedProps.checked
                }));

                // 날짜와 방별로 정렬된 스케줄을 그룹화
                const groupedSchedules = Object.keys(roomNames).reduce((acc, roomId) => {
                    acc[roomId] = {
                        roomName: roomNames[roomId],
                        schedules: filteredSchedules
                            .filter(schedule => schedule.roomId === parseInt(roomId, 10))
                            .sort((a, b) => a.scheduleName.localeCompare(b.scheduleName))
                    };
                    return acc;
                }, {});

                console.log('Filtered Schedules:', groupedSchedules);
                setSchedules(Object.values(groupedSchedules));

            })
            .catch(error => {
                console.error('Error fetching schedules:', error);
            });
    };

    const openEditModal = (schedule, e) => {
        e.stopPropagation();
        setSelectedSchedule(schedule);
        setUpdatedScheduleName(schedule.scheduleName);
        setEditModalIsOpen(true);
    };

    const closeEditModal = () => {
        setEditModalIsOpen(false);
        setSelectedSchedule(null);
        setUpdatedScheduleName('');
    };

    const openAddModal = () => {
        setNewScheduleName('');
        setNewScheduleDetail('');
        setAddModalIsOpen(true);
    };

    const closeAddModal = () => {
        setAddModalIsOpen(false);
    };

    const handleScheduleUpdate = () => {
        fetch(`${BACK_URL}/calendar/updateName/${selectedSchedule.scheduleId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ scheduleName: updatedScheduleName })
        })
            .then(response => response.json())
            .then(data => {
                setEvents(events.map(event =>
                    event.extendedProps.scheduleId === data.scheduleId ?
                        { ...event, title: data.scheduleName } : event
                ));
                closeEditModal();
            })
            .catch(error => {
                console.error('Error updating schedule name:', error);
            });
    };

    const handleCheckboxChange = (scheduleId, isChecked) => {
        // 즉시 UI 업데이트
        setSchedules(schedules.map(room => ({
            ...room,
            schedules: room.schedules.map(sch =>
                sch.scheduleId === scheduleId ?
                    { ...sch, scheduleIsChecked: isChecked } : sch
            )
        })));

        fetch(`${BACK_URL}/calendar/updateChecked/${scheduleId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ checked: isChecked })
        })
            .then(response => response.json())
            .then(data => {
                // 서버 응답 확인 및 UI 업데이트
                setEvents(events.map(event =>
                    event.extendedProps.scheduleId === data.scheduleId ?
                        { ...event, extendedProps: { ...event.extendedProps, checked: data.checked } } : event
                ));
            })
            .catch(error => {
                console.error('Error updating schedule checked status:', error);
                // 서버 요청 실패 시 UI 상태를 원래대로 되돌림
                setSchedules(schedules.map(room => ({
                    ...room,
                    schedules: room.schedules.map(sch =>
                        sch.scheduleId === scheduleId ?
                            { ...sch, scheduleIsChecked: !isChecked } : sch
                    )
                })));
            });
    };

    const handleCheckboxToggle = (scheduleId, e) => {
        e.stopPropagation();
        const schedule = schedules.flatMap(room => room.schedules).find(sch => sch.scheduleId === scheduleId);
        if (schedule) {
            handleCheckboxChange(scheduleId, !schedule.scheduleIsChecked);
        }
    };



    const handleDelete = (scheduleId) => {
        fetch(`${BACK_URL}/calendar/delete/${scheduleId}`, {
            method: 'DELETE',
        })
            .then(() => {
                setSchedules(schedules.map(room => ({
                    ...room,
                    schedules: room.schedules.filter(sch => sch.scheduleId !== scheduleId)
                })));
                setEvents(events.filter(event => event.extendedProps.scheduleId !== scheduleId));
                closeEditModal();
            })
            .catch(error => {
                console.error('Error deleting schedule:', error);
            });
    };

    const handleAddSchedule = () => {
        if (!selectedDate || !newScheduleName) {
            alert('Please provide a schedule name and select a date.');
            return;
        }

        const newSchedule = {
            scheduleName: newScheduleName,
            scheduleDetail: newScheduleDetail,
            scheduleDate: selectedDate
        };

        fetch(`${BACK_URL}/calendar/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newSchedule)
        })
            .then(response => response.json())
            .then(data => {
                const newEvent = {
                    title: data.scheduleName,
                    start: data.scheduleDate,
                    extendedProps: {
                        roomId: data.roomId,
                        details: data.scheduleDetail,
                        scheduleId: data.scheduleId,
                        checked: data.scheduleIsChecked
                    }
                };
                setEvents([...events, newEvent]);
                setSchedules(schedules.map(room => ({
                    ...room,
                    schedules: [...room.schedules, newEvent]
                })));
                closeAddModal();
            })
            .catch(error => {
                console.error('Error adding new schedule:', error);
            });
    };

    return (
        <div className="calendar-container">
            <div className="calendar">
                <FullCalendar
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    dateClick={handleDateClick}
                    aspectRatio={1.1}
                />
            </div>
            <button className="add-schedule-button" onClick={openAddModal}>
                <FontAwesomeIcon icon={faPlus} /> Add Schedule
            </button>
            <div className="modal-overlay"></div>
            <div className="list-modal">
                <div className="modal-header">
                    <h2>{selectedDate}</h2>
                </div>
                <div className="modal-content">
                    {Object.keys(schedules).length > 0 ? (
                        Object.keys(schedules).map(roomId => (
                            <div key={roomId} className={`room-section room-${roomId}`}>
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
                                            <p>{schedule.scheduleDetail}</p>
                                        </li>
                                    ))}
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
                            <button onClick={closeEditModal} className="close-button">X</button>
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
                            <h2>Add New Schedule</h2>
                            <button onClick={closeAddModal} className="close-button">X</button>
                        </div>
                        <div className="edit-modal-content">
                            <label htmlFor="newScheduleName">Schedule Name:</label>
                            <input
                                id="newScheduleName"
                                value={newScheduleName}
                                onChange={(e) => setNewScheduleName(e.target.value)}
                            />
                            <label htmlFor="newScheduleDetail">Details:</label>
                            <textarea
                                id="newScheduleDetail"
                                value={newScheduleDetail}
                                onChange={(e) => setNewScheduleDetail(e.target.value)}
                            />
                            <button onClick={handleAddSchedule}>Add Schedule</button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Calendar;
