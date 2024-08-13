import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../css/routine/routine.module.css';
import Footer from '../../jsx/fix/Footer.jsx';
import {useLogin} from "../../contexts/AuthContext.jsx";
import axiosInstance from "../../config/axiosInstance.js";

const Routine = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [routineGroups, setRoutineGroups] = useState([]);
    const [newRoutineName, setNewRoutineName] = useState('');

    const { user } = useLogin();

    useEffect(() => {
        const fetchRoutineGroups = async () => {
            try {
                const response = await axiosInstance.get(`/routine/groups`, {
                    params: { userId: user.userId }
                });
                setRoutineGroups(response.data);
            } catch (error) {
                console.error('Error fetching routine groups:', error);
            }
        };

        fetchRoutineGroups();
    }, [user.userId]);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleRoutineClick = (groupName) => {
        navigate(`/routine/daily/${groupName}`);
    };

    const handleAddRoutine = () => {
        if (newRoutineName.trim() === '') {
            alert('루틴 이름을 입력하세요.');
            return;
        }

        // 새 루틴 이름을 URL에 포함시켜 이동
        navigate(`/routine/daily/${newRoutineName}`);
    };

    const handleRecommendRoutineClick = () => {
        // 새 루틴 이름을 URL에 포함시켜 이동
        navigate(`/routine/recommend/daily`);
    };


    return (
        <div className={styles.container}>
            <div className={styles.routineTitle}>
                <h1>내 청소 루틴</h1>
            </div>
            <div className={styles.routineEditAdd}>
                <p className={styles.edit} onClick={() => navigate('/routine/edit')}>적용 루틴 수정</p>
                <p className={styles.add} onClick={openModal}>루틴 추가<img src="/lib/plus.svg" alt="add"/></p>
            </div>

            <div className={styles.routine}>
                <button
                    type="button"
                    className={styles.roomRoutine}
                    onClick={() => handleRecommendRoutineClick()}
                >
                    <p>루미의 추천 루틴</p>
                </button>
            </div>

            {routineGroups.map((groupName, index) => (
                <div className={styles.routine} key={`routine-group-${index}`}>
                    <button
                        type="button"
                    className={styles.roomRoutine}
                    onClick={() => handleRoutineClick(groupName)}
                >
                    <p>{groupName}</p>
                </button>
            </div>
            ))}


            {isModalOpen && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <span className={styles.close} onClick={closeModal}>&times;</span>
                        <h2>루틴 추가</h2>
                        <div className={styles.routineName}>
                            <label htmlFor="routineName">루틴 명</label>
                            <input
                                type="text"
                                id="routineName"
                                value={newRoutineName}
                                onChange={(e) => setNewRoutineName(e.target.value)} // 입력값 상태 업데이트
                            />
                        </div>
                        <div className={styles.routineColor}>
                            <label>색상</label>
                            <div className={styles.colorOptions}>
                                <input type="radio" id="color1" name="routineColor" value="color1"/>
                                <label htmlFor="color1" className={styles.colorBox}
                                       style={{backgroundColor: '#c5f1ff'}}></label>
                                <input type="radio" id="color2" name="routineColor" value="color2"/>
                                <label htmlFor="color2" className={styles.colorBox}
                                       style={{backgroundColor: '#ffc5d1'}}></label>
                                <input type="radio" id="color3" name="routineColor" value="color3"/>
                                <label htmlFor="color3" className={styles.colorBox}
                                       style={{backgroundColor: '#ffebc5'}}></label>
                            </div>
                        </div>
                        <div className={styles.routineGroupList}>
                            <h3>루틴 그룹명</h3>
                            <ul>
                                {routineGroups.map((groupName, index) => (
                                    <li key={index}>{groupName}</li>
                                ))}
                            </ul>
                        </div>
                        <button type="button" className={styles.modalAddBtn} onClick={handleAddRoutine}>루틴 추가</button>
                        <button type="button" className={styles.modalCancelBtn} onClick={closeModal}>취소</button>
                    </div>
                </div>
            )}
            <Footer/>
        </div>
    );
};

export default Routine;
