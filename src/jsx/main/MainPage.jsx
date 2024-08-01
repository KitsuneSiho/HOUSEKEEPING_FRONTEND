import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../css/main/mainPage.module.css';
import Footer from '../../jsx/fix/Footer.jsx';
import moment from 'moment-timezone';
import { BACK_URL } from "../../Constraints.js";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBell, faBellSlash, faCheckSquare, faPlus, faSquare} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
const MainPage = () => {

    const [selectedDate, setSelectedDate] = useState(null);
    const [events, setEvents] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [editModalIsOpen, setEditModalIsOpen] = useState(false);
    const [addModalIsOpen, setAddModalIsOpen] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [updatedScheduleName, setUpdatedScheduleName] = useState('');
    const [newScheduleName, setNewScheduleName] = useState('');
    const [selectedRoomId, setSelectedRoomId] = useState(null);
    const [friends, setFriends] = useState([]);


    // 초기 페이지 로드 시 오늘 날짜의 스케줄을 띄움
    useEffect(() => {
        const today = moment().format('YYYY-MM-DD');
        handleDateClick({ dateStr: today });

        // 친구 목록 가져오기
        const userId = 1;
        axios.get(`${BACK_URL}/friend/list`, {
            params: {
                userId: userId
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

    // 날짜 별 스케줄 보여주는 기능
    const handleDateClick = (arg) => {
        setSelectedDate(arg.dateStr);

        // 근데 이거 잘 모르겠음
        // 세션에는 사용자의 방 3개가 저장되어 있음
        // 그럼 그 중에 Main 방이 뭔지 어떻게 알지?
        const roomIds = JSON.parse(sessionStorage.getItem('roomIds')) || [5];
        const roomNames = JSON.parse(sessionStorage.getItem('roomNames')) || {
            5: '재영방'
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

    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <div className={styles.friendsContainer}>
                <div className={styles.friendsList}>
                    {friends.map(friend => (
                        <div className={styles.friend} key={friend.userId}
                             onClick={() => navigate(`/friendRoom/${friend.userId}`)}>
                            <img src={`public/lib/${friend.userId}.png`} alt={friend.userId}/>
                            <p>{friend.nickname}</p>
                        </div>
                    ))}
                    <div className={styles.addFriend} onClick={() => navigate('/addFriend')}>
                        <img src="public/lib/plus.svg" alt="add"/>
                        <p>친구 추가</p>
                    </div>
                </div>
            </div>

            <div className={styles.dirtyBar}>
                <img src="public/lib/오염도바.svg" alt="오염도 바"/>
            </div>
            <div className={styles.roomDesign}>
                <img src="public/lib/왼쪽화살표.svg" alt="왼쪽 화살표" onClick={() => navigate('/mainToiletRoom')}/>
                <img className={styles.myRoom} src="public/lib/내방.png" alt="내 방"/>
                <img src="public/lib/오른쪽화살표.svg" alt="오른쪽 화살표" onClick={() => navigate('/mainLivingRoom')}/>
            </div>
            <div className={styles.guestBook}>
                <p onClick={() => navigate('/MyGuestBook')}>방명록</p>
            </div>
            <div className="list-modal">
                <div className="modal-header">
                    <h2>{selectedDate}</h2>
                </div>
                <div className={styles.listModal}>
                    {Object.keys(schedules).length > 0 ? (
                        Object.keys(schedules).map((roomId) => (
                            <div key={roomId} className={styles.roomSection}>
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

export default MainPage;
