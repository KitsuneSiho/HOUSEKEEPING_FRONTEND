import {Route, Routes} from "react-router-dom";
import FirstMain from "../jsx/first/FirstMain.jsx";
import Login from "../jsx/first/Login.jsx";
import FirstLogin from "../jsx/first/FirstLogin.jsx";
import FirstRoomDesign from "../jsx/first/FirstRoomDesign.jsx";
import FirstLivingRoom from "../jsx/first/FirstLivingRoom.jsx";
import FirstToiletRoom from "../jsx/first/FirstToiletRoom.jsx";
import IntroAnimation from "../pages/first/IntroAnimation.jsx";
import {SocketProvider} from "../contexts/SocketContext.jsx";
import RouteAuthProvider from "../contexts/RouteAuthContext.jsx";

const DefaultRouter = () => {

    return (
        <>
            {/* 시작 라우터 */}
            {/* / */}
            <Routes>
                <Route path="/" element={<IntroAnimation/>}/>
                <Route path="/first" element={<FirstMain/>}/> {/* HouseKeeping로고만 있는 첫 화면 */}
                <Route path="/login" element={<Login/>}/> {/* 로그인 화면 */}
                <Route path="/*" element={
                    // <RouteAuthProvider>
                        <SocketProvider>
                            <FirstLogin/>
                        </SocketProvider>
                    // </RouteAuthProvider>
                }/> {/* 첫 로그인시 추가 정보 입력창 */}
                <Route path="/design/myroom" element={
                    // <RouteAuthProvider>
                        <SocketProvider>
                            <FirstRoomDesign/>
                        </SocketProvider>
                    // </RouteAuthProvider>
                }/> {/* 첫 로그인시 방 디자인 화면 */}
                <Route path="/design/livingroom" element={
                    // <RouteAuthProvider>
                        <SocketProvider>
                            <FirstLivingRoom/>
                        </SocketProvider>
                    // </RouteAuthProvider>
                }/> {/* 첫 로그인시 주방 디자인 화면 */}
                <Route path="/design/toilet" element={
                    // <RouteAuthProvider>
                        <SocketProvider>
                            <FirstToiletRoom/>
                        </SocketProvider>
                    // </RouteAuthProvider>
                }/> {/* 첫 로그인시 화장실 디자인 화면 */}
            </Routes>
        </>
    )
}

export default DefaultRouter;