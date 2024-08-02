import '../../css/modal/InviteFriendModal.css';
import PropTypes from "prop-types";
import {useEffect, useRef, useState} from "react";
import axios from "axios";
import {BACK_URL} from "../../Constraints.js";
import InviteElement from "./elements/InviteElement.jsx";

// 값을 입력받는 모달
const InviteFriendModal = ({modalState, modalTitle, modalBody, modalCallback, hideModal}) => {

    const [roomMembers, setRoomMembers] = useState([]);
    const [friends, setFriends] = useState([]);
    const [selectedFriends, setSelectedFriends] = useState([]);
    const userContainerRef = useRef(null);
    const scrollTimeoutRef = useRef(null);

    useEffect(() => {

        if (modalState === "show") {
            getRoomMembersAndFriends();
        }
    }, [modalState]);

    const getRoomMembersAndFriends = async () => {

        try {

            const response = await axios.get(BACK_URL + `/chat/room/invite/list?chatRoomId=${modalTitle}&userId=${modalBody}`);

            setRoomMembers(response.data.roomMembers);
            setFriends(response.data.friends);
        } catch (error) {

            console.error("error getting room members and friends list:", error);
        }
    }

    // 스크롤 이벤트 핸들러
    const handleScroll = () => {
        if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
        }

        userContainerRef.current.classList.add(" scrolling");

        scrollTimeoutRef.current = setTimeout(() => {
            userContainerRef.current.classList.remove(" scrolling");
        }, 600);
    };

    // 체크박스 체크 시
    const handleCheckboxChange = (roomMember) => {
        setSelectedFriends(prev =>
            prev.some(friend => friend.userId === roomMember.userId) ? prev.filter(friend => friend.userId !== roomMember.userId) : [...prev, roomMember]
        );
    };

    useEffect(() => {
        console.log(selectedFriends);
    }, [selectedFriends])

    const handleConfirm = () => {

        modalCallback(selectedFriends);
        hideModal();
    }

    return (
        <div className={`modal ${modalState}`}>
            <div className="invite-modal-content">
                <div className="title-area">
                    <span className="invite-modal-title">친구 초대</span>
                </div>
                <div className="invite-modal-body" ref={userContainerRef} onScroll={handleScroll}>
                    <div className="area-title">Invited</div>
                    <div className="invited-friends-area">
                        <InviteElement users={roomMembers} type={"invited"}/>
                    </div>
                    <div className="area-title">Invite more</div>
                    <div className="invite-friends-area">
                        <InviteElement users={friends} type={"invite"} selectedFriends={selectedFriends}
                                       handleCheckboxChange={handleCheckboxChange}/>
                    </div>
                </div>
                <div className="buttons-area">
                    <button className="close-button" onClick={handleConfirm}>초대</button>
                    <button className="close-button" onClick={hideModal}>취소</button>
                </div>

            </div>
        </div>
    );
};

// 받은 props의 타입 확인. 매치되지 않으면 오류 발생
InviteFriendModal.propTypes = {
    modalState: PropTypes.string,
    modalTitle: PropTypes.string,
    modalBody: PropTypes.string,
    modalCallback: PropTypes.func,
    hideModal: PropTypes.func,
}

export default InviteFriendModal;
