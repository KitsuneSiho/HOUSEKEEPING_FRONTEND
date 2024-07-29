import '../../css/modal/InformModal.css';
import PropTypes from "prop-types";
import { useState } from "react";

// 그룹 채팅방 제목을 설정하는 모달
const NamingChatRoomModal = ({ modalState, modalCallback, hideModal }) => {
    // 채팅 방 제목
    const [title, setTitle] = useState("");

    const handleCreate = () => {
        // 아무것도 입력하지 않을 경우
        if (title === "") {
            // 입력 칸 테두리 빨갛게 하면 좋을듯
            return;
        }

        setTitle("");

        modalCallback(title);
        hideModal();
    }

    return (
        <div className={`modal ${modalState}`}>
            <div className="modal-content">
                <span className="modal-title">그룹 채팅 방 이름 입력</span>
                <p className="modal-body">
                    <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={"채팅 방 이름을 입력해주세요"} />
                </p>
                <button className="close-button" onClick={handleCreate}>생성</button>
                <button className="close-button" onClick={hideModal}>취소</button>
            </div>
        </div>
    );
};

// 받은 props의 타입 확인. 매치되지 않으면 오류 발생
NamingChatRoomModal.propTypes = {
    modalState: PropTypes.string,
    modalCallback: PropTypes.func,
    hideModal: PropTypes.func,
}

export default NamingChatRoomModal;
