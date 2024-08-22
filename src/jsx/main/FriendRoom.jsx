import {useState, useEffect} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import styles from '../../css/main/friendRoom.module.css'; // CSS 모듈 임포트
import Footer from '../../jsx/fix/Footer.jsx';
import axiosInstance from "../../config/axiosInstance.js";
import RoomModel from "../../components/room/RoomModel.jsx";


const FriendRoom = () => {
    const navigate = useNavigate();
    const {userId} = useParams(); // URL 파라미터로부터 userId를 추출
    const [friend, setFriend] = useState({
        nickname: "",
    });
    const [rooms, setRooms] = useState([]);
    const [placementLists, setPlacementLists] = useState([]);
    const [currentRoom, setCurrentRoom] = useState(0);
    const [isReady, setReady] = useState(false);

    useEffect(() => {

        if (userId !== "") {
            getUserById();
            getRoomIds();
        }

    }, [userId])

    useEffect(() => {

        if (JSON.stringify(rooms) !== JSON.stringify([])) {
            getPlacementLists().then(() => setReady(true));
        }
    }, [rooms])

    const getUserById = async () => {

        try {

            const response = await axiosInstance.get(`/api/user/info?userId=${userId}`);

            setFriend(response.data);
        } catch (error) {
            console.error("Error getting user info:", error);
        }
    }

    const getRoomIds = async () => {

        try {

            const response = await axiosInstance.get(`/room/list?userId=${userId}`);

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

    const changeCurrentRoom = (adder) => {

        const newRoomNumber = currentRoom + adder;

        if (newRoomNumber >= 0) {
            setCurrentRoom(newRoomNumber % 3);
        } else {
            setCurrentRoom(newRoomNumber + 3);
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <img
                    src="/lib/back.svg"
                    alt="back"
                    onClick={() => navigate('/main')}
                />
                <h2>{friend.nickname}님의 House</h2>
            </div>

            <div className={styles.dirtyBar}>
                <img src="/lib/오염도바.svg" alt="오염도바"/>
            </div>

            <div className={styles.roomDesign}>
                <img className={styles.arrowImg} src="/lib/왼쪽화살표.svg" alt="왼쪽 화살표" onClick={() => changeCurrentRoom(-1)}/>
                <div className={styles.roomView}>
                    {isReady && rooms.map((room, index) => (
                        <div key={index}>
                            {currentRoom === index &&
                                <RoomModel room={room} placementList={placementLists[index]}/>}
                        </div>
                    ))}
                </div>
                <img className={styles.arrowImg} src="/lib/오른쪽화살표.svg" alt="오른쪽 화살표" onClick={() => changeCurrentRoom(1)}/>
            </div>

            <div className={styles.visitorBoard}>
                <button
                    type="button"
                    onClick={() => navigate(`/friend/visitorBoard/${userId}`)}>
                    방명록 작성</button>
            </div>
            <Footer/>
        </div>
    );
};

export default FriendRoom;
