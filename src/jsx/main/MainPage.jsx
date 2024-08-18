import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../css/main/mainPage.module.css';
import Footer from '../../jsx/fix/Footer.jsx';
import RoomView from '../../jsx/room/RoomView.jsx';
import moment from 'moment-timezone';
import PullutionBar from '../../components/test/PollutionBar.jsx';
import axiosInstance from "../../config/axiosInstance.js";
import { useAuth as useLogin } from '../../contexts/AuthContext';
import RoomModel from "../../components/room/RoomModel.jsx";
import FriendTop from "../../components/friend/FriendTop.jsx";

const MainPage = () => {

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
    // 방 모델 출력 관련
    const [rooms, setRooms] = useState([]);
    const [placementLists, setPlacementLists] = useState([]);
    const [isReady, setReady] = useState(false);
    const navigate = useNavigate();

    const [pollution, setPollution] = useState(0); // 초기값을 0으로 설정
    const [specificRoomId, setSpecificRoomId] = useState(null); // 특정 방 ID를 저장할 상태
    const [lastCheckedTimes, setLastCheckedTimes] = useState({}); // 각 스케줄의 마지막 체크 시간

    // JWT 토큰에서 user_id 추출 함수
    const parseJwt = (token) => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error("JWT 토큰 파싱 중 오류 발생:", error);
            return null;
        }
    };

    // 토큰에서 userId 추출 함수
    const getUserIdFromToken = () => {
        const access = localStorage.getItem('access');
        if (!access) {
            console.error("토큰이 없습니다. 로그인 페이지로 이동합니다.");
            navigate('/login');
            return null;
        }

        const decodedToken = parseJwt(access);
        return decodedToken ? decodedToken.userId : null;
    };

    // DB에서 초기 오염도 값을 로드하는 함수
    const fetchInitialPollution = async (specificRoomId) => {
        const access = localStorage.getItem('access');

        if (!access) {
            console.error("토큰이 없습니다. 로그인 페이지로 이동합니다.");
            navigate('/login');
            return;
        }

        // 유저 id 확인
        const userId = getUserIdFromToken();
        if (!userId) {
            console.error("userId를 토큰에서 추출할 수 없습니다.");
            return;
        }

        console.log("유저 id:", userId);

        try {
            const response = await axiosInstance.get(`/room/getPollution`, {
                params: {
                    roomIds: [specificRoomId], // 현재 페이지에 해당하는 specificRoomId만 전달

                },
                headers: {
                    Authorization: `Bearer ${access}`, // 인증 토큰 포함
                },
            });
            const pollutionData = response.data;

            if (pollutionData.length > 0) {
                setPollution(pollutionData[0].roomPollution); // specificRoomId에 해당하는 오염도 설정
            } else {
                console.error("No pollution data found for the specified room.");
            }
        } catch (error) {
            console.error("Error fetching pollution data:", error);
        }
    };

    // roomIds에서 특정 roomId 설정
    useEffect(() => {
        if (roomIds.length > 0) {
            setSpecificRoomId(roomIds[0]); // roomIds 배열의 첫 번째 방 ID를 specificRoomId로 설정
        }
    }, [roomIds]);

    // DB에서 초기 오염도 값을 로드하는 함수 호출
    useEffect(() => {
        if (user && specificRoomId) {
            fetchInitialPollution(specificRoomId); // 유저가 존재하고 specificRoomId가 있을 때만 호출
        }
    }, [user, specificRoomId]);

    // 오염도 업데이트 함수
    const updateRoomPollution = async (pollutionValue) => {
        const access = localStorage.getItem('access');
        const userId = getUserIdFromToken();

        if (!access || !userId) {
            console.error("토큰이 없거나 사용자 ID가 없습니다.");
            navigate('/login');
            return;
        }

        try {
            // 현재 방(specificRoomId)의 오염도 업데이트
            await axiosInstance.patch(
                `/room/updatePollution`,
                {
                    roomId: specificRoomId,
                    pollution: pollutionValue,
                },
                {
                    headers: {
                        Authorization: `Bearer ${access}`,
                    },
                }
            );
        } catch (error) {
            console.error("Error updating room pollution:", error);
        }
    };

// 일정 시간마다 오염도를 증가시키는 타이머 설정
    useEffect(() => {
        const interval = setInterval(() => {
            let additionalPollution = 0; // 추가로 더할 오염도
            const currentTime = Date.now();

            // 스케줄별로 마지막 체크 시간에 따라 오염도 계산
            Object.values(schedules).flatMap(room => room.schedules).forEach(schedule => {
                const lastChecked = lastCheckedTimes[schedule.scheduleId] || currentTime;
                const timeElapsed = currentTime - lastChecked;

                // 예: 1초 이상 경과하면 오염도 증가
                if (timeElapsed > 3000 && !schedule.scheduleIsChecked) {
                    additionalPollution += 5;
                }
            });

            setPollution(prevPollution => {
                const newPollution = prevPollution + additionalPollution;
                const finalPollution = newPollution > 100 ? 100 : newPollution;

                // roomId가 설정되어 있는 경우에만 DB 업데이트
                if (roomIds.length > 0) {
                    updateRoomPollution(finalPollution, roomIds);
                }

                return finalPollution;
            });
        }, 3000);

        return () => clearInterval(interval);
    }, [schedules, lastCheckedTimes, roomIds]);


    useEffect(() => {


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
            const initialLastCheckedTimes = fetchedEvents.reduce((acc, event) => {
                acc[event.extendedProps.scheduleId] = Date.now();
                return acc;
            }, {});
            setLastCheckedTimes(initialLastCheckedTimes);
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

            if (isChecked) {
                // 사용자가 체크박스를 클릭하면 오염도를 감소시킵니다.
                const newPollution = Math.max(0, pollution - 10); // 예: 20만큼 감소
                setPollution(newPollution);
                await updateRoomPollution(newPollution, roomIds); // 업데이트된 오염도를 DB에 저장
            }

            setLastCheckedTimes({
                ...lastCheckedTimes,
                [scheduleId]: Date.now(),
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

    // 방 모델 출력 관련
    useEffect(() => {

        if (user !== null) {

            getRoomIds();
        }
    }, [user])

    useEffect(() => {

        if (JSON.stringify(rooms) !== JSON.stringify([])) {
            getPlacementLists().then(() => setReady(true));
        }
    }, [rooms])

    const getRoomIds = async () => {

        try {

            const response = await axiosInstance.get(`/room/list?userId=${user.userId}`);

            setRooms(response.data);
        } catch (error) {
            console.error("Error fetching room:", error);
        }
    }

    const getPlacementLists = async () => {

        try {

            const response = await axiosInstance.get(`/placement/list/all?roomIds=${rooms[0].roomId}&roomIds=${rooms[1].roomId}&roomIds=${rooms[2].roomId}`);

            setPlacementLists(response.data);
        } catch (error) {
            console.error("Error fetching placementLists", error);
        }
    }


    return (
        <div className={styles.container}>
            <FriendTop/>

            <div className={styles.dirtyBar}>
                    <PullutionBar pollution={pollution}/>

            </div>
            <div className={styles.roomDesign}>
                <img src="/lib/왼쪽화살표.svg" alt="왼쪽 화살표" onClick={() => navigate('/main/toilet')}/>
                <div className={styles.roomView}>
                    {isReady && <RoomModel room={rooms[0]} placementList={placementLists[0]}/>}
                </div>
                <img src="/lib/오른쪽화살표.svg" alt="오른쪽 화살표" onClick={() => navigate('/main/livingroom')}/>
            </div>
            <div className={styles.scheduleList}>
                {Object.keys(schedules).map((roomId, idx) => (
                    // 첫 번째 방(PRIVATE)만 렌더링
                    idx === 0 && (
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
                                            <img
                                                src={schedule.scheduleIsChecked ? "/lib/내방체크on.svg" : "/lib/내방체크off.svg"}
                                                alt="check"/>
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

export default MainPage;
