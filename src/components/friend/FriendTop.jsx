import {useSocket} from "../context/SocketContext.jsx";
import {useEffect, useState} from "react";
import styles from "../../css/main/mainPage.module.css";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {BACK_URL} from "../../Constraints.js";

// 현재 친구 접속 상태를 실시간으로 업데이트 해주는 친구 목록
const FriendTop = () => {

    const {onlineFriends} = useSocket();
    const [isReady, setIsReady] = useState(false);
    const [friends, setFriends] = useState([]);
    const [userId, setUserId] = useState("");
    const navigate = useNavigate();

    // 세션에서 유저 번호를 받아옴
    useEffect(() => {

        setUserId(sessionStorage.getItem("userId"));
    }, []);

    // 유저 번호를 세션에서 받아온 뒤 친구 목록을 DB에서 받아옴. 그 후 컴포넌트를 준비 상태로 변환
    useEffect(() => {

        if (userId !== "") {
            getFriends(userId).then(() => setIsReady(true));
        }
    }, [userId]);

    // 매개변수로 받은 닉네임을 가진 유저가 온라인 상태인지 확인
    const isOnline = (data) => {

        const isFriendOnline = onlineFriends.some(nickname => nickname === data);

        if (isFriendOnline) {
            return "online";
        } else {
            return "offline";
        }
    }

    // 친구 목록을 DB에서 받아옴
    const getFriends = async () => {
        try {
            const response = await axios.get(BACK_URL + `/friend/list?userId=${userId}`);
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
                    {isReady && friends.map((friend, index) => (
                        <div className={styles.friend} key={index} onClick={() => navigate('/friendRoom')}>
                            <img src={`public/lib/친구${index + 1}.png`} alt={index}/>
                            <p>{`${friend.nickname}/${isOnline(friend.nickname)}`}</p>
                        </div>
                    ))}
                    <div className={styles.addFriend} onClick={() => navigate('/addFriend')}>
                        <img src="public/lib/plus.svg" alt="add"/>
                        <p>친구 추가</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default FriendTop