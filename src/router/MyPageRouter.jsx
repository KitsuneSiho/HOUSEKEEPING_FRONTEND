import {Route, Routes} from "react-router-dom";
import MyPage from "../jsx/myPage/MyPage.jsx";
import MyInfo from "../jsx/myPage/MyInfo.jsx";
import Setting from "../jsx/myPage/Setting.jsx";
import DeleteUser from "../jsx/myPage/DeleteUser.jsx";
import GuestBook from "../jsx/myPage/GuestBook.jsx";
import RouteAuthProvider from "../contexts/RouteAuthContext.jsx";
import {SocketProvider} from "../contexts/SocketContext.jsx";
import EditRoom from "../pages/room/EditRoom.jsx";
import ChatAlarm from "../pages/chat/ChatAlarm.jsx";

const MyPageRouter = () => {

    return (
        <>
            {/* 마이페이지 관련 기능 */}
            {/* /mypage */}
            <SocketProvider>
                <RouteAuthProvider>
                    <Routes>
                        <Route path="/" element={<MyPage/>}/> {/* 마이페이지 */}
                        <Route path="/info" element={<MyInfo/>}/> {/* 내정보  */}
                        <Route path="/setting" element={<Setting/>}/> {/* 설정 */}
                        <Route path="/delete" element={<DeleteUser/>}/> {/* 회원탈퇴 */}
                        <Route path="/guestBook/storage" element={<GuestBook/>}/> {/* 방명록 보관함 */}
                        <Route path="/myroom/edit/:isFirst" element={<EditRoom/>}/>
                    </Routes>
                    <ChatAlarm/>
                </RouteAuthProvider>
            </SocketProvider>
        </>
    )
}

export default MyPageRouter