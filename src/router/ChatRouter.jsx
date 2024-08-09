import {ModalProvider} from "../contexts/ModalContext.jsx";
import {Route, Routes} from "react-router-dom";
import {SocketProvider} from "../contexts/SocketContext.jsx";
import ChatLogin from "../pages/chat/ChatLogin.jsx";
import ChatRoomList from "../pages/chat/ChatRoomList.jsx";
import ChatRoomPage from "../pages/chat/ChatRoomPage.jsx";
import CreateChat from "../pages/chat/CreateChat.jsx";

const ChatRouter = () => {

    return (
        <>
            {/* 기본 라우터 */}
            {/* /chat */}
            <SocketProvider>
                <ModalProvider>
                    <Routes>
                        <Route path="/login" element={<ChatLogin/>}/>   {/*임시로 만든 채팅 로그인*/}
                        <Route path="/" element={<ChatRoomList/>}/>     {/*채팅 방 리스트*/}
                        <Route path="/:chatRoomId" element={<ChatRoomPage/>}/>      {/*채팅 방 상세*/}
                        <Route path="/create" element={<CreateChat/>}/>         {/*채팅 방 생성*/}
                    </Routes>
                </ModalProvider>
            </SocketProvider>
        </>
    )
}

export default ChatRouter