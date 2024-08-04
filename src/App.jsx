import {Route, BrowserRouter as Router, Routes} from "react-router-dom";
import './font/font.css';
import ModalExample from "./components/test/ModalExample.jsx";
import {ModalProvider} from "./components/context/ModalContext.jsx";
import ChatRouter from "./router/ChatRouter.jsx";
import DefaultRouter from "./router/DefaultRouter.jsx";
import MainRouter from "./router/MainRouter.jsx";
import FriendRouter from "./router/FriendRouter.jsx";
import RoutineRouter from "./router/RoutineRouter.jsx";
import RefrigeratorRouter from "./router/RefrigeratorRouter.jsx";
import ClosetRouter from "./router/ClosetRouter.jsx";
import TipRouter from "./router/TipRouter.jsx";
import MyPageRouter from "./router/MyPageRouter.jsx";
import TempLogin from "./pages/first/TempLogin.jsx";
import RoomDisplayTest from "./pages/first/RoomDisplayTest.jsx";
import RoomEditTest from "./pages/first/RoomEditTest.jsx";

function App() {

    return (
        <>
            <ModalProvider>
                <Router>
                    <Routes>

                        {/* 기본 및 로그인, 처음 로그인 시 정보 입력 */}
                        <Route path="/*" element={<DefaultRouter/>}/>

                        {/* 메인 페이지 및 방명록 */}
                        <Route path="/main/*" element={<MainRouter/>}/>

                        {/* 친구 관련 기능 */}
                        <Route path="/friend/*" element={<FriendRouter/>}/>

                        {/* 루틴 관련 기능 */}
                        <Route path="/routine/*" element={<RoutineRouter/>}/>

                        {/* 냉장고 관련 기능 */}
                        <Route path="/refrigerator/*" element={<RefrigeratorRouter/>}/>

                        {/* 옷장 관련 기능 */}
                        <Route path="/closet/*" element={<ClosetRouter/>}/>

                        {/* 팁 관련 기능 */}
                        <Route path="/tip/*" element={<TipRouter/>}/>

                        {/* 마이페이지 관련 기능 */}
                        <Route path="/mypage/*" element={<MyPageRouter/>}/>

                        {/* 채팅 라우터 */}
                        <Route path="/chat/*" element={<ChatRouter/>}/>

                        {/*    테스트 컴포넌트를 라우팅하는 부분입니다*/}
                        <Route path="/test/modal" element={<ModalExample/>}/>
                        <Route path="/test/login" element={<TempLogin/>}/>
                        <Route path="/test/room" element={<RoomDisplayTest/>}/>
                        <Route path="/test/room/edit" element={<RoomEditTest/>}/>
                    </Routes>
                </Router>
            </ModalProvider>
        </>
    )
}

export default App
