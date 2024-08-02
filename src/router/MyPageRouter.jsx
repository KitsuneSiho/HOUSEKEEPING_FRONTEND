import {Route, Routes} from "react-router-dom";
import MyPage from "../jsx/myPage/MyPage.jsx";
import MyInfo from "../jsx/myPage/MyInfo.jsx";
import Setting from "../jsx/myPage/Setting.jsx";
import DeleteUser from "../jsx/myPage/DeleteUser.jsx";

const MyPageRouter = () => {

    return (
        <>
            {/* 마이페이지 관련 기능 */}
            {/* /mypage */}
            <Routes>
                <Route path="/" element={<MyPage/>}/> {/* 마이페이지 */}
                <Route path="/info" element={<MyInfo/>}/> {/* 내정보  */}
                <Route path="/setting" element={<Setting/>}/> {/* 설정 */}
                <Route path="/delete" element={<DeleteUser/>}/> {/* 회원탈퇴 */}
            </Routes>
        </>
    )
}

export default MyPageRouter