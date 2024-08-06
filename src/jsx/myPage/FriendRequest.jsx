import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BACK_URL } from '../../Constraints.js';
import styles from '../../css/myPage/friendRequest.module.css';
import Footer from '../../jsx/fix/Footer.jsx';
import { useNavigate } from 'react-router-dom';

const FriendRequest = () => {
    const [requests, setRequests] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const userId = 3; // 현재 로그인한 사용자 ID로 대체해야 함
                const response = await axios.get(`${BACK_URL}/friendRequest/received`, {
                    params: { userId }
                });
                setRequests(response.data);
            } catch (error) {
                console.error("친구 요청 가져오기 실패:", error);
            }
        };

        fetchRequests();
    }, []);

    const handleAcceptRequest = async (requestId) => {
        try {
            await axios.post(`${BACK_URL}/friendRequest/accept`, null, {
                params: { requestId }
            });
            setRequests(requests.filter(req => req.requestId !== requestId));
        } catch (error) {
            console.error("친구 요청 수락 실패:", error);
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
                        <img src="/lib/마이페이지아이콘.svg" alt={request.senderNickname} />
                        <span>{request.senderNickname}</span>
                        <button onClick={() => handleAcceptRequest(request.requestId)}>팔로우 승인</button>
                    </div>
                ))}
            </div>

            <Footer />
        </div>
    );
};

export default FriendRequest;
