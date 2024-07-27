import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BACK_URL } from "../../Constraints.js";
import styles from '../../css/chat/createChat.module.css';
import Footer from '../../jsx/fix/Footer.jsx';
import axios from "axios";
import FriendElement from "./elements/FriendElement.jsx";
import { useModal } from "../context/ModalContext.jsx";

const CreateChat = () => {
    const navigate = useNavigate();
    const { setModalType, setModalTitle, setModalBody, showModal, setModalCallback } = useModal();
    const [userId, setUserId] = useState(null);
    const [selectedFriends, setSelectedFriends] = useState([]);
    const [friends, setFriends] = useState([]);
    const [isReady, setIsReady] = useState(false);
    const [chatRoomTitle, setChatRoomTitle] = useState("");

    useEffect(() => {
        setUserId(sessionStorage.getItem("userId"));
    }, []);

    useEffect(() => {
        if (userId !== null) {
            getFriends().then(() => setIsReady(true));
        }
    }, [userId]);

    useEffect(() => {
        if (chatRoomTitle !== "") {
            createRoom(chatRoomTitle, "GROUP").then(() => setModalTitle(""));
        }
    }, [chatRoomTitle]);

    const getFriends = async () => {
        try {
            const response = await axios.get(BACK_URL + `/friend/list?userId=${userId}`);
            setFriends(response.data);
        } catch (error) {
            console.log("Error fetching friends: ", error);
        }
    }

    const createRoom = async (name, type) => {
        try {
            const response = await axios.post(BACK_URL + `/chat/room/create`, {
                chatRoomName: name,
                chatRoomType: type,
                userIdList: [userId, ...selectedFriends],
            });

            navigate(`/chat/${response.data.chatRoomId}`);

        } catch {
            console.log("Error creating room");
        }
    }

    const handleCheckboxChange = (name) => {
        setSelectedFriends(prev =>
            prev.includes(name) ? prev.filter(friend => friend !== name) : [...prev, name]
        );
    };

    const handleAddChat = () => {
        if (selectedFriends.length === 0) {
            setModalType("inform");
            setModalTitle("방 생성 불가");
            setModalBody("한 명 이상의 친구를 선택해주세요!");
            showModal();
        } else if (selectedFriends.length === 1) {
            createRoom("", "SINGLE");
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
                    src="/lib/back.svg"
                    alt="back"
                    onClick={() => navigate('/chat')}
                />
                <h2>대화 상대 선택</h2>
                <h4 onClick={handleAddChat}>추가</h4>
            </div>
            <div className={styles.friendList}>
                {isReady && friends.map((friend, index) => (
                    <FriendElement key={index} friend={friend} selectedFriends={selectedFriends}
                        handleCheckboxChange={handleCheckboxChange} />
                ))}
            </div>
            <Footer />
        </div>
    );
};

export default CreateChat;
