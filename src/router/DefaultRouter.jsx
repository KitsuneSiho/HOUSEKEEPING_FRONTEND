import {Route, Routes} from "react-router-dom";
import FirstMain from "../jsx/first/FirstMain.jsx";
import Login from "../jsx/first/Login.jsx";
import FirstLogin from "../jsx/first/FirstLogin.jsx";
import FirstRoomDesign from "../jsx/first/FirstRoomDesign.jsx";
import FirstLivingRoom from "../jsx/first/FirstLivingRoom.jsx";
import FirstToiletRoom from "../jsx/first/FirstToiletRoom.jsx";
import IntroAnimation from "../pages/first/IntroAnimation.jsx";
import TempLogin from "../pages/first/TempLogin.jsx";
import {SocketProvider} from "../contexts/SocketContext.jsx";
import RouteAuthProvider from "../contexts/RouteAuthContext.jsx";

const DefaultRouter = () => {

    return (
        <>
            {/* 시작 라우터 */}
            {/* / */}
            <SocketProvider>
                <Routes>
                    <Route path="/" element={<IntroAnimation/>}/>
                    <Route path="/first" element={<FirstMain/>}/> {/* HouseKeeping로고만 있는 첫 화면 */}
                    <Route path="/login" element={<Login/>}/> {/* 로그인 화면 */}
                    <Route path="/*" element={
                        <RouteAuthProvider>
                            <FirstLogin/>
                        </RouteAuthProvider>}/> {/* 첫 로그인시 추가 정보 입력창 */}
                    <Route path="/design/myroom" element={
                        <RouteAuthProvider>
                            <FirstRoomDesign/>
                        </RouteAuthProvider>}/> {/* 첫 로그인시 방 디자인 화면 */}
                    <Route path="/design/livingroom" element={
                        <RouteAuthProvider>
                            <FirstLivingRoom/>
                        </RouteAuthProvider>}/> {/* 첫 로그인시 주방 디자인 화면 */}
                    <Route path="/design/toilet" element={
                        <RouteAuthProvider>
                            <FirstToiletRoom/>
                        </RouteAuthProvider>}/> {/* 첫 로그인시 화장실 디자인 화면 */}

                    {/*  임시 로그인 페이지  */}
                    <Route path="/temp/login" element={<TempLogin/>}/>
                </Routes>
            </SocketProvider>
        </>
    )
}

export default DefaultRouter;