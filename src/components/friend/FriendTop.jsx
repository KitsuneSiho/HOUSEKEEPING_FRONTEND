import { useSocket } from "../../contexts/SocketContext.jsx";
import React, { useEffect, useState } from "react";
import styles from "../../css/friend/friendTop.module.css";
import { useNavigate } from "react-router-dom";
import {useLogin} from "../../contexts/AuthContext.jsx";
import axiosInstance from "../../config/axiosInstance.js";

// 현재 친구 접속 상태를 실시간으로 업데이트 해주는 친구 목록
const FriendTop = () => {

    const { onlineFriends } = useSocket();
    const {user} = useLogin();
    const [isReady, setIsReady] = useState(false);
    const [friends, setFriends] = useState([]);
    const navigate = useNavigate();

    // 유저 번호를 세션에서 받아온 뒤 친구 목록을 DB에서 받아옴. 그 후 컴포넌트를 준비 상태로 변환
    useEffect(() => {
        if (user.userId !== null) {
            getFriends(user.userId).then(() => setIsReady(true));
        }
    }, [user]);

    // 매개변수로 받은 닉네임을 가진 유저가 온라인 상태인지 확인
    const isOnline = (data) => {
        return onlineFriends.some(nickname => nickname === data);
    }

    // 친구 목록을 DB에서 받아옴
    const getFriends = async () => {
        try {
            const response = await axiosInstance.get(`/friend/list?userId=${user.userId}`);
            setFriends(response.data);
        } catch (error) {
            console.log("Error fetching friends: ", error);
        }
    }

    return (
        <>
            {/* 친구 목록 출력 */}
            <div className={styles.friendsContainer}>
                <div className={styles.friendsList}>
                    {isReady && friends.filter((friend) => isOnline(friend.nickname)).map((friend, index) => (
                        <div className={styles.friend} key={index} onClick={() => navigate(`/friend/friendRoom/${friend.userId}`)}>
                            <img src={`public/lib/친구${index + 1}.png`} alt={index}/>
                            <p>{friend.nickname}</p>
                            <span className={`${styles.statusIndicator} ${isOnline(friend.nickname) ? styles.online : styles.offline}`}></span>
                        </div>
                    ))}

                    {isReady && friends.filter((friend) => !isOnline(friend.nickname)).map((friend, index) => (
                        <div className={styles.friend} key={index} onClick={() => navigate(`/friend/friendRoom/${friend.userId}`)}>
                            <img src={`public/lib/친구${index + 1}.png`} alt={index}/>
                            <p>{friend.nickname}</p>
                            <span className={`${styles.statusIndicator} ${isOnline(friend.nickname) ? styles.online : styles.offline}`}></span>
                        </div>
                    ))}
                    <div className={styles.addFriend} onClick={() => navigate('/friend/add')}>
                        <img src="/lib/plus.svg" alt="add"/>
                        <p>친구 추가</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default FriendTop;
