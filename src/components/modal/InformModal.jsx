import '../../css/modal/InformModal.css';
import PropTypes from "prop-types";

const InformModal = ({ modalState, modalTitle, modalBody, hideModal }) => {

    // 받은 props의 타입 확인. 매치되지 않으면 오류 발생
    InformModal.propTypes = {
        modalState: PropTypes.string,
        modalTitle: PropTypes.string,
        modalBody: PropTypes.string,
        hideModal: PropTypes.func,
    }

    return (
        <div className={`modal ${modalState}`}>
            <div className="modal-content">
                <span className="modal-title">{modalTitle}</span>
                <p className="modal-body">{modalBody}</p>
                <button className="close-button" onClick={hideModal}>확인</button>
            </div>
        </div>
    );
};

export default InformModal;