import '../../css/modal/InformModal.css';
import PropTypes from "prop-types";
import {useState} from "react";

// 값을 입력받는 모달
const InputModal = ({modalState, modalTitle, modalBody, modalCallback, hideModal}) => {

    const [input, setInput] = useState("");

    const handleInput = () => {
        // 아무것도 입력하지 않을 경우
        if (input === "") {
            // 입력 칸 테두리 빨갛게 하면 좋을듯
            return;
        }

        setInput("");

        modalCallback(input);
        hideModal();
    }

    return (
        <div className={`modal ${modalState}`}>
            <div className="modal-content">
                <span className="modal-title">{modalTitle}</span>
                <div className="modal-body">
                    <div>
                        {modalBody}
                    </div>
                    <div>
                        <input value={input} onChange={(e) => setInput(e.target.value)}
                               placeholder={"채팅 방 이름을 입력해주세요"}/>
                    </div>
                </div>
                <button className="close-button" onClick={handleInput}>확인</button>
                <button className="close-button" onClick={hideModal}>취소</button>
            </div>
        </div>
    );
};

// 받은 props의 타입 확인. 매치되지 않으면 오류 발생
InputModal.propTypes = {
    modalState: PropTypes.string,
    modalTitle: PropTypes.string,
    modalBody: PropTypes.string,
    modalCallback: PropTypes.func,
    hideModal: PropTypes.func,
}

export default InputModal;
