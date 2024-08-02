import {ModalProvider} from "../components/context/ModalContext.jsx";
import {Route, Routes} from "react-router-dom";
import {SocketProvider} from "../components/context/SocketContext.jsx";
import ChatLogin from "../components/chat/ChatLogin.jsx";
import ChatRoomList from "../components/chat/ChatRoomList.jsx";
import ChatRoom from "../components/chat/ChatRoom.jsx";
import CreateChat from "../components/chat/CreateChat.jsx";

const ChatRouter = () => {

    return (
        <>
            <SocketProvider>
            <ModalProvider>
                    <Routes>
                        {/* 채팅 */}
                        <Route path="/login" element={<ChatLogin/>}/>
                        <Route path="/" element={<ChatRoomList/>}/>
                        <Route path="/:chatRoomId" element={<ChatRoom/>}/>
                        <Route path="/create" element={<CreateChat/>}/>
                    </Routes>
            </ModalProvider>
            </SocketProvider>
        </>
    )
}

export default ChatRouter