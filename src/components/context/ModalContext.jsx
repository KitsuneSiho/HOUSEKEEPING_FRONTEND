import {createContext, useState, useContext} from 'react';
import InformModal from "../modal/InformModal.jsx";
import PropTypes from "prop-types";
import NamingChatRoomModal from "../modal/NamingChatRoomModal.jsx";

// Context 생성
const ModalContext = createContext();

// Context Provider
export const ModalProvider = ({children}) => {
    const [modalType, setModalType] = useState("");
    const [modalTitle, setModalTitle] = useState("");
    const [modalBody, setModalBody] = useState("");
    const [modalState, setModalState] = useState("hide");
    const [modalCallback, setModalCallback] = useState(null);

    const showModal = () => {
        setModalState("show");
    }

    const hideModal = () => {
        setModalState("hide");
    }

    return (
        <ModalContext.Provider
            value={{setModalType, setModalTitle, setModalBody, setModalCallback, showModal, hideModal}}>
            {/*제작한 모달 컴포넌트를 여기에 넣어서 한번에 관리 가능*/}
            {modalType === "inform" &&
                <InformModal modalState={modalState} modalTitle={modalTitle} modalBody={modalBody}
                             hideModal={hideModal}/>}
            {modalType === "namingChatRoom" &&
                <NamingChatRoomModal modalState={modalState} modalCallback={modalCallback} hideModal={hideModal} />}
            {children}
        </ModalContext.Provider>
    );
};

// porps 타입 지정
ModalProvider.propTypes = {
    children: PropTypes.node,
}

// Custom hook
export const useModal = () => {
    return useContext(ModalContext);
};