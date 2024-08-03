import {Route, Routes} from "react-router-dom";
import ClosetRoom from "../jsx/clothes/ClosetRoom.jsx";
import UploadCloset from "../jsx/clothes/UploadCloset.jsx";
import UploadClosetCheck from "../jsx/clothes/UploadClosetCheck.jsx";
import RecommendCloset from "../jsx/clothes/RecommendCloset.jsx";
import TopList from "../jsx/clothes/TopList.jsx";

const ClosetRouter = () => {

    return (
        <>
            {/* 옷장 관련 기능 */}
            {/* /closet */}
            <Routes>
                <Route path="/" element={<ClosetRoom/>}/> {/* 옷방 메인 화면 */}
                <Route path="/list" element={<TopList/>}/> {/* 내 옷 리스트 (카테고리별 파일 만들어야됨) */}
                <Route path="/register" element={<UploadCloset/>}/> {/* 옷 등록(카메라만있음) */}
                <Route path="/register/check" element={<UploadClosetCheck/>}/> {/* 옷 등록 확인 */}
                <Route path="/recommend" element={<RecommendCloset/>}/> {/* 옷 추천 */}
            </Routes>
        </>
    )
}

export default ClosetRouter