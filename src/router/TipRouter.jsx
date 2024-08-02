import {Route, Routes} from "react-router-dom";
import Tip from "../jsx/tip/Tip.jsx";
import RoomeTip from "../jsx/tip/RoomeTip.jsx";
import RoomeTipDetail from "../jsx/tip/RoomeTipDetail.jsx";
import WasteTip from "../jsx/tip/WasteTip.jsx";
import WasteTipDetail from "../jsx/tip/WasteTipDetail.jsx";
import WasteTipWrite from "../jsx/tip/WasteTipWrite.jsx";
import LifeTip from "../jsx/tip/LifeTIp.jsx";
import LifeTipDetail from "../jsx/tip/LifeTipDetail.jsx";
import LifeTipWrite from "../jsx/tip/LifeTipWrite.jsx";

const TipRouter = () => {

    return (
        <>
            {/* 팁 관련 기능 */}
            {/* /tip */}
            <Routes>
                <Route path="/" element={<Tip/>}/> {/* 팁 메인 화면 */}

                <Route path="/roome" element={<RoomeTip/>}/> {/* 루미`s 팁 */}
                <Route path="/roome/detail" element={<RoomeTipDetail/>}/> {/* 루미`s 팁 게시글 내용 */}

                <Route path="/waste" element={<WasteTip/>}/> {/* 폐기물 팁 */}
                <Route path="/waste/detail" element={<WasteTipDetail/>}/> {/* 폐기물 팁 게시글 내용 */}
                <Route path="/waste/post" element={<WasteTipWrite/>}/> {/* 폐기물 팁 게시글 작성 내용 */}

                <Route path="/listfacks" element={<LifeTip/>}/> {/* 일상 팁 */}
                <Route path="/listfacks/detail" element={<LifeTipDetail/>}/> {/* 일상 팁 게시글 내용 */}
                <Route path="/listfacks/post" element={<LifeTipWrite/>}/> {/* 일상 팁 게시글 작성 */}
            </Routes>
        </>
    )
}

export default TipRouter;