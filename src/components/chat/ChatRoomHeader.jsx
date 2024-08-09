import styles from "../../css/chat/chatRoom.module.css";
import PropTypes from "prop-types";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {useSocket} from "../../contexts/SocketContext.jsx";
import axios from "axios";
import {BACK_URL} from "../../Constraints.js";
import {useModal} from "../../contexts/ModalContext.jsx";

const ChatRoomHeader = ({chatRoomType, chatRoomName, userId}) => {

    const {room, nickname, announceRoom} = useSocket();
    const {setModalType, setModalTitle, setModalBody, setModalCallback, showModal} = useModal();
    const [menuShow, setMenuShow] = useState(false);
    const [inputName, setInputName] = useState("");
    const navigate = useNavigate();

    useEffect(() => {

        if (inputName !== "") {
            try {

                axios.put(BACK_URL + `/chat/room/rename?chatRoomId=${room}&chatRoomName=${inputName}`).then(response => {
                    if (response.status === 200) {
                        const message = `방의 이름이 ${inputName}으로 변경되었습니다`;

                        announceMessage(message).then(() => announceRoom(message));
                    }
                });
            } catch (error) {
                console.error("error renaming chat room:", error);
            }
        }

    }, [inputName])

    const renameChatRoom = () => {

        if (menuShow) {
            setModalType("input");
            setModalTitle("채팅 방 이름 변경");
            setModalBody("변경할 채팅 방 이름을 입력해 주세요");
            setModalCallback(() => setInputName);

            showModal();
        }

    }

    const inviteConfirm = () => {
        if (menuShow) {
            setModalType("friend");
            setModalTitle(room);
            setModalBody(userId);
            setModalCallback(() => inviteUser);

            showModal();
        }
    }

    const quitConfirm = () => {

        if (menuShow) {
            setModalType("confirm");
            setModalTitle("확인");
            setModalBody("방을 나가시겠습니까?");
            setModalCallback(() => quitChatRoom);

            showModal();
        }
    }

    const inviteUser = async (selectedFriends) => {

        try {

            const response = await axios.post(BACK_URL + `/chat/room/invite?chatRoomId=${room}`, {
                chatRoomId: room,
                users: selectedFriends,
            });

            if (response.status === 200) {

                selectedFriends.map((selectedFriend) => {

                    const message = `${selectedFriend.nickname}님을 초대했습니다`;
                    announceMessage(message).then(() => announceRoom(message));
                })
            }
        } catch (error) {
            console.log("error inviting users:", error);
        }
    }

    const quitChatRoom = async () => {

        try {

            const response = await axios.delete(BACK_URL + `/chat/room/quit?chatRoomId=${room}&userId=${userId}`);

            if (response.status === 200) {

                const message = `${nickname} 님이 방에서 나갔습니다`;

                announceMessage(message).then(() => announceRoom(message));
                navigate("/chat");
            }
        } catch (error) {
            console.log("error quitting chat room:", error);
        }
    }

    // 공지 전송
    const announceMessage = async (message) => {
        try {
            await axios.post(`${BACK_URL}/chat/message/send`, {
                "chatRoomId": room,
                "messageSenderId": 0,
                "messageContent": message,
            });

        } catch (error) {
            console.error('Error getting RoomList: ', error);
        }
    };

    return (
        <>
            <div className={styles.header}>
                <img
                    className={styles.back}
                    src="/lib/back.svg"
                    alt="back"
                    onClick={() => navigate('/chat')}
                />
                <h2>{chatRoomName}</h2>
                <div className={styles.iconArea}>
                    <img
                        className={styles.menuIcon}
                        src="/lib/chatRoom/menu.png"
                        alt="menu"
                        onClick={() => setMenuShow(!menuShow)}
                    />
                    <div
                        className={`${styles.renameBackground} ${menuShow ? styles.show : styles.hidden} ${chatRoomType === "SINGLE" ? styles.single : ""}`}>
                        <img
                            className={`${styles.renameIcon}`}
                            src="/lib/chatRoom/rename.png"
                            alt="rename"
                            onClick={renameChatRoom}
                        />
                    </div>
                    <div
                        className={`${styles.inviteBackground} ${menuShow ? styles.show : styles.hidden} ${chatRoomType === "SINGLE" ? styles.single : ""}`}>
                        <img
                            className={`${styles.inviteIcon}`}
                            src="/lib/chatRoom/invite.png"
                            alt="invite"
                            onClick={inviteConfirm}
                        />
                    </div>
                    <div
                        className={`${styles.exitBackground} ${menuShow ? styles.show : styles.hidden} ${chatRoomType === "SINGLE" ? styles.single : ""}`}>
                        <img
                            className={`${styles.exitIcon}`}
                            src="/lib/chatRoom/exit.png"
                            alt="exit"
                            onClick={quitConfirm}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

ChatRoomHeader.propTypes = {
    chatRoomName: PropTypes.string,
    chatRoomType: PropTypes.string,
    userId: PropTypes.string,
}

export default ChatRoomHeader;
