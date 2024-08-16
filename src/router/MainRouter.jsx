import {Route, Routes} from "react-router-dom";
import MainPage from "../jsx/main/MainPage.jsx";
import MainLivingRoom from "../jsx/main/MainLivingRoom.jsx";
import MainToiletRoom from "../jsx/main/MainToiletRoom.jsx";
import MyGuestBook from "../jsx/main/MyGuestBook.jsx";
import RouteAuthProvider from "../contexts/RouteAuthContext.jsx";
import {SocketProvider} from "../contexts/SocketContext.jsx";
import MyRoom from "../pages/room/MyRoom.jsx";

const MainRouter = () => {

    return (
        <>
            {/* 메인 화면과 방명록 */}
            {/* /main */}
            <SocketProvider>
                <RouteAuthProvider>
                    <Routes>
                        <Route path="/" element={<MainPage/>}/> {/* 메인화면 */}
                        <Route path="/livingroom" element={<MainLivingRoom/>}/> {/* 메인 주방 */}
                        <Route path="/toilet" element={<MainToiletRoom/>}/> {/* 메인 화장실 */}
                        <Route path="/guestbook" element={<MyGuestBook/>}/> {/* 내방 방명록 */}
                        <Route path="/myroom" element={<MyRoom/>}/>
                    </Routes>
                </RouteAuthProvider>
            </SocketProvider>
        </>
    )
}

export default MainRouter;