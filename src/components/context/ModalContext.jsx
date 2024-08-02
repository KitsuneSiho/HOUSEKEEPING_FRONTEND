import {createContext, useState, useContext} from 'react';
import InformModal from "../modal/InformModal.jsx";
import PropTypes from "prop-types";
import NamingChatRoomModal from "../modal/NamingChatRoomModal.jsx";
import InputModal from "../modal/InputModal.jsx";
import ConfirmModal from "../modal/ConfirmModal.jsx";
import InviteFriendModal from "../modal/InviteFriendModal.jsx";

// Context 생성
const ModalContext = createContext();

// Context Provider
export const ModalProvider = ({children}) => {
    const [modalType, setModalType] = useState("");
    const [modalTitle, setModalTitle] = useState("");
    const [modalBody, setModalBody] = useState("");
    const [modalState, setModalState] = useState("hide");
    const [modalCallback, setModalCallback] = useState(null);

    // 모달을 나타내는 함수
    const showModal = () => {
        setModalState("show");
    }

    // 모달을 숨기는 함수
    const hideModal = () => {
        setModalState("hide");
    }

    return (
        <ModalContext.Provider
            // 커스텀 훅을 이용해서 useState / 함수를 제공
            value={{setModalType, setModalTitle, setModalBody, setModalCallback, showModal, hideModal}}>
            {/*제작한 모달 컴포넌트를 여기에 넣어서 한번에 관리 가능*/}
            {modalType === "inform" &&
                // 일반적인 알림 모달
                <InformModal modalState={modalState} modalTitle={modalTitle} modalBody={modalBody}
                             hideModal={hideModal}/>}
            {modalType === "namingChatRoom" &&
                // 그룹 채팅 방 제목을 설정하는 모달
                <NamingChatRoomModal modalState={modalState} modalCallback={modalCallback} hideModal={hideModal} />}
            {modalType === "input" &&
                // 값을 입력받는 모달
                <InputModal modalState={modalState} modalTitle={modalTitle} modalBody={modalBody} modalCallback={modalCallback} hideModal={hideModal} />}
            {modalType === "confirm" &&
                // 확인 모달
                <ConfirmModal modalState={modalState} modalTitle={modalTitle} modalBody={modalBody} modalCallback={modalCallback} hideModal={hideModal} />}
            {modalType === "friend" &&
                // 친구들을 방에 초대하는 모달
                <InviteFriendModal modalState={modalState} modalTitle={modalTitle} modalBody={modalBody} modalCallback={modalCallback} hideModal={hideModal} />}
            {children}
        </ModalContext.Provider>
    );
};

// porps 타입 지정
ModalProvider.propTypes = {
    children: PropTypes.node,
}

// 커스텀 훅
export const useModal = () => {
    return useContext(ModalContext);
};