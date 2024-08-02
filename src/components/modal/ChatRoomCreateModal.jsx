import '../../css/modal/InformModal.css';
import PropTypes from "prop-types";
import {useNavigate} from "react-router-dom";

// 만들었다가 피드백을 받아서 일단 사용하고 있지 않은 모달.
// 채팅 방 생성 시 1대1 채팅인지 그룹 채팅인지 확인
const ChatRoomCreateModal = ({modalState, hideModal}) => {

    const navigate = useNavigate();

    const createSingleRoom = () => {
        navigate("/chat/create");
    }

    const createGroupRoom = () => {
        navigate("/chat/create");
    }

    return (
        <div className={`modal ${modalState}`}>
            <div className="modal-content">
                <span className="modal-title">채팅 방 생성</span>
                <p className="modal-body">
                    <button onClick={createSingleRoom}>1대1 채팅 생성</button>
                    <button onClick={createGroupRoom}>그룹 채팅 생성</button>
                </p>
                <button className="close-button" onClick={hideModal}>닫기</button>
            </div>
        </div>
    );
};

// 받은 props의 타입 확인. 매치되지 않으면 오류 발생
ChatRoomCreateModal.propTypes = {
    modalState: PropTypes.string,
    modalTitle: PropTypes.string,
    modalBody: PropTypes.string,
    hideModal: PropTypes.func,
}

export default ChatRoomCreateModal