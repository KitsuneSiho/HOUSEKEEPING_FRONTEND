import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import styles from '../../css/chat/createChat.module.css';
import Footer from '../../jsx/fix/Footer.jsx';
import ChatFriend from "../../components/chat/ChatFriend.jsx";
import {useModal} from "../../contexts/ModalContext.jsx";
import {useLogin} from "../../contexts/AuthContext.jsx";
import axiosInstance from "../../config/axiosInstance.js";
import ChatAlarm from "./ChatAlarm.jsx";

// 채팅 방 생성
const CreateChat = () => {
    const navigate = useNavigate();
    const { setModalType, setModalTitle, setModalBody, showModal, setModalCallback } = useModal();
    const {user} = useLogin();
    const [selectedFriends, setSelectedFriends] = useState([]);
    const [selectedNicknames, setSelectedNicknames] = useState("");
    const [friends, setFriends] = useState([]);
    const [isReady, setIsReady] = useState(false);
    const [chatRoomTitle, setChatRoomTitle] = useState("");

    // 유저 아이디를 받아오는 데 성공하면 준비 완료 신호를 보냄
    useEffect(() => {
        if (user.userId !== null) {
            getFriends().then(() => setIsReady(true));
        }
    }, [user]);

    // 1대1 채팅인지 그룹 채팅인지 판별
    useEffect(() => {
        if (chatRoomTitle !== "") {
            createRoom(chatRoomTitle, "GROUP").then(() => setModalTitle(""));
        }
    }, [chatRoomTitle]);

    // 친구 목록을 DB에서 받아옴
    const getFriends = async () => {
        try {
            const response = await axiosInstance.get(`/friend/list?userId=${user.userId}`);
            setFriends(response.data);
        } catch (error) {
            console.log("Error fetching friends: ", error);
        }
    }

    // 선택한 친구와의 1대1 채팅이 이미 만들어져 있는지 확인
    const checkChatRoom = async () => {

        try {

            const response = await axiosInstance.get(`/chat/room/exist?myUserId=${user.userId}&friendUserId=${selectedFriends[0]}`);
            const chatRoomId = response.data;

            if (chatRoomId === "") {
                createRoom(selectedNicknames[0], "SINGLE");
            } else if (typeof chatRoomId === "number") {
                navigate(`/chat/${chatRoomId}`);
            }
        } catch (error) {
            console.error("error checking chat room:", error);
        }
    }

    // 방 정보를 DB에 저장
    const createRoom = async (name, type) => {
        try {
            const response = await axiosInstance.post(`/chat/room/create`, {
                chatRoomName: name,
                chatRoomType: type,
                userIdList: [user.userId, ...selectedFriends],
            });

            navigate(`/chat/${response.data.chatRoomId}`);

        } catch {
            console.log("Error creating room");
        }
    }

    // 체크박스 체크 시
    const handleCheckboxChange = (id, nickanme) => {
        setSelectedFriends(prev =>
            prev.includes(id) ? prev.filter(friend => friend !== id) : [...prev, id]
        );

        setSelectedNicknames(prev =>
            prev.includes(nickanme) ? prev.filter(friend => friend !== nickanme) : [...prev, nickanme]
        );
    };

    // 채팅 방 생성 버튼 클릭 시
    const handleAddChat = () => {
        if (selectedFriends.length === 0) {
            setModalType("inform");
            setModalTitle("방 생성 불가");
            setModalBody("한 명 이상의 친구를 선택해주세요!");
            showModal();
        } else if (selectedFriends.length === 1) {

            checkChatRoom();
        } else if (selectedFriends.length >= 2) {
            setModalType("namingChatRoom");
            setModalCallback(() => setChatRoomTitle);
            showModal();
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <img
                    className={styles.back}
                    src="/lib/back.svg"
                    alt="back"
                    onClick={() => navigate('/chat')}
                />
                <h2>대화 상대 선택</h2>
                <h4 className={styles.addChat} onClick={handleAddChat}>추가</h4>
            </div>
            <div className={styles.friendList}>
                {/* 준비 완료되기 전에는 친구 목록을 출력 안함 */}
                {isReady && friends.map((friend, index) => (
                    <ChatFriend key={index} friend={friend} selectedFriends={selectedFriends}
                                handleCheckboxChange={handleCheckboxChange}/>
                ))}
            </div>
            <ChatAlarm/>
            <Footer />
        </div>
    );
};

export default CreateChat;
