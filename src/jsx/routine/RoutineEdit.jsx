import React, { useState, useEffect } from 'react';
import styles from '../../css/routine/routine.module.css';
import Footer from '../../jsx/fix/Footer.jsx';
import axiosInstance from "../../config/axiosInstance.js";
import {useLogin} from "../../contexts/AuthContext.jsx";
import {useNavigate} from "react-router-dom";

const Routine = () => {
    const [routineGroups, setRoutineGroups] = useState([]);
    const [oldActiveRoutine, setOldActiveRoutine] = useState(''); // State to manage the active routine
    const [activeRoutine, setActiveRoutine] = useState('');
    const navigate = useNavigate();
    const { user } = useLogin();

    useEffect(() => {
        const fetchRoutineGroups = async () => {
            try {
                const response = await axiosInstance.get(`/routine/groups`, {
                    params: { userId: user.userId }
                });
                setRoutineGroups(response.data);

                const activeRoutineResponse = await axiosInstance.get('/routine/checked-group-names', {
                    params: { userId: user.userId }
                });
                setOldActiveRoutine(activeRoutineResponse.data);
                setActiveRoutine(activeRoutineResponse.data);
            } catch (error) {
                console.error('Error fetching routine groups:', error);
            }
        };

        fetchRoutineGroups();
    }, [user.userId]);

    const handleRoutineClick = (groupName) => {
        setActiveRoutine(groupName);
    };

    const handleEditComplete = async () => {
        try {

            console.log(oldActiveRoutine);
            console.log(activeRoutine);
            // 현재 적용 중인 루틴과 새 루틴 그룹명을 서버로 전송
            const response = await axiosInstance.post('/routine/apply', null, {
                params: {
                    oldRoutineGroupName: oldActiveRoutine, // 현재 적용 중인 루틴
                    newRoutineGroupName: activeRoutine // 새 루틴 그룹명
                }
            });

            console.log('서버 응답:', response.data); // 응답 데이터 로그 출력

            // 백엔드에 데이터 전송 후 루틴 페이지로 이동
            navigate('/routine');
        } catch (error) {
            console.error('Error updating routine:', error.response ? error.response.data : error.message);
        }
    };



    return (
        <div className={styles.container}>
            <div className={styles.routineTitle}>
                <h1>내 청소 루틴</h1>
            </div>
            <div className={styles.routineEditAdd}>
                <p className={styles.edit} onClick={handleEditComplete}>수정 완료</p>
            </div>
            <div className={styles.routine}>
                <p className={styles.onRoutine}>현재 적용 중인 루틴</p>
                {routineGroups.map((groupName, index) => (
                    <button
                        key={`routine-group-${index}`}
                        type="button"
                        className={activeRoutine === groupName ? styles.myRoutine : styles.roomRoutine} // Apply different styles based on active routine
                        onClick={() => handleRoutineClick(groupName)}
                    >
                        <p>{groupName}</p>
                    </button>
                ))}
            </div>
            <Footer/>
        </div>
    );
};

export default Routine;
