import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BACK_URL } from '../../Constraints.js';
import styles from '../../css/myPage/friendRequest.module.css';
import Footer from '../../jsx/fix/Footer.jsx';
import { useNavigate } from 'react-router-dom';
import {useLogin} from "../../contexts/AuthContext.jsx";
import axiosInstance from "../../config/axiosInstance.js";

const FriendRequest = () => {

    const {user} = useLogin();
    const [requests, setRequests] = useState([]);
    const navigate = useNavigate();


    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await axiosInstance.get('/friendRequest/received', {
                    params: { userId: user.userId }
                });
                setRequests(response.data);
            } catch (error) {
                console.error("친구 요청 가져오기 실패:", error);
            }
        };

        fetchRequests();
    }, [user.userId]);

    const handleAcceptRequest = async (requestId) => {
        try {
            await axiosInstance.post('/friendRequest/accept', null, {
                params: { requestId }
            });
            setRequests(requests.filter(req => req.requestId !== requestId));
        } catch (error) {
            console.error("친구 요청 수락 실패:", error);
        }
    };

    const handleRejectRequest = async (requestSenderId) => {
        try {
            await axiosInstance.post('/friendRequest/reject', null, {
                params: {
                    senderId: requestSenderId,
                    receiverId: user.userId
                }
            });
            setRequests(requests.filter(req => req.requestSenderId !== requestSenderId));
        } catch (error) {
            console.error("친구 요청 거부 실패:", error);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <img className={styles.back}
                     src="/lib/back.svg"
                     alt="back"
                     onClick={() => navigate('/myPage')}
                />
                <h2>친구 요청</h2>
            </div>

            <div className={styles.searchResults}>
                {requests.map((request) => (
                    <div key={request.requestId} className={styles.searchResultItem}>
                        <img src="/lib/마이페이지아이콘.svg" alt={request.senderNickname}/>
                        <span>{request.senderNickname}</span>
                        <button onClick={() => handleAcceptRequest(request.requestId)}>승인</button>
                        <button onClick={() => handleRejectRequest(request.requestSenderId)}>거부</button>
                    </div>
                ))}
            </div>

            <Footer/>
        </div>
    );
};

export default FriendRequest;
