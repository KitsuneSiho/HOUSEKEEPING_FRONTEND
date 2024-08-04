import {Route, Routes} from "react-router-dom";
import Home from "../components/Home.jsx";
import FirstMain from "../jsx/first/FirstMain.jsx";
import Login from "../jsx/first/Login.jsx";
import FirstLogin from "../jsx/first/FirstLogin.jsx";
import FirstRoomDesign from "../jsx/first/FirstRoomDesign.jsx";
import FirstLivingRoom from "../jsx/first/FirstLivingRoom.jsx";
import FirstToiletRoom from "../jsx/first/FirstToiletRoom.jsx";

const DefaultRouter = () => {

    return (
        <>
            {/* 시작 라우터 */}
            {/* / */}
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/first" element={<FirstMain/>}/> {/* HouseKeeping로고만 있는 첫 화면 */}
                <Route path="/login" element={<Login/>}/> {/* 로그인 화면 */}
                <Route path="/*" element={<FirstLogin/>}/> {/* 첫 로그인시 추가 정보 입력창 */}
                <Route path="/design/myroom" element={<FirstRoomDesign/>}/> {/* 첫 로그인시 방 디자인 화면 */}
                <Route path="/design/livingroom" element={<FirstLivingRoom/>}/> {/* 첫 로그인시 주방 디자인 화면 */}
                <Route path="/design/toilet" element={<FirstToiletRoom/>}/> {/* 첫 로그인시 화장실 디자인 화면 */}
            </Routes>
        </>
    )
}

export default DefaultRouter;