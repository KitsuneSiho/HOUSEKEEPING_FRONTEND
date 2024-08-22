import {Route, Routes} from "react-router-dom";
import Tip from "../jsx/tip/Tip.jsx";
import RoomeTip from "../jsx/tip/RoomeTip.jsx";
import RoomeTipDetail from "../jsx/tip/RoomeTipDetail.jsx";
import WasteTip from "../jsx/tip/WasteTip.jsx";
import WasteTipDetail from "../jsx/tip/WasteTipDetail.jsx";
import WasteTipWrite from "../jsx/tip/WasteTipWrite.jsx";
import LifeTip from "../jsx/tip/LifeTip.jsx";
import LifeTipDetail from "../jsx/tip/LifeTipDetail.jsx";
import LifeTipWrite from "../jsx/tip/LifeTipWrite.jsx";
import RouteAuthProvider from "../contexts/RouteAuthContext.jsx";
import {SocketProvider} from "../contexts/SocketContext.jsx";
import RoomeTipWrite from "../jsx/tip/RoomeTipWrite.jsx";
import WasteTipEdit from "../jsx/tip/WasteTipEdit.jsx";
import LifeTipEdit from "../jsx/tip/LifeTipEdit.jsx";
import RoomeTipEdit from "../jsx/tip/RoomeTipEdit.jsx";

const TipRouter = () => {

    return (
        <>
            {/* 팁 관련 기능 */}
            {/* /tip */}
            <SocketProvider>
                <RouteAuthProvider>
                    <Routes>
                        <Route path="/" element={<Tip/>}/> {/* 팁 메인 화면 */}

                        <Route path="/roome" element={<RoomeTip/>}/> {/* 루미`s 팁 */}
                        <Route path="/roome/detail/:id" element={<RoomeTipDetail/>}/> {/* 루미`s 팁 게시글 내용 */}
                        <Route path="/roome/post" element={<RoomeTipWrite/>}/> {/* 루미`s 팁 게시글 작성 */}
                        <Route path="/roome/edit/:id" element={<RoomeTipEdit/>}/> {/* 루미`s 팁 게시글 수정 내용 */}

                        <Route path="/waste" element={<WasteTip/>}/> {/* 폐기물 팁 */}
                        <Route path="/waste/detail/:id" element={<WasteTipDetail/>}/> {/* 폐기물 팁 게시글 내용 */}
                        <Route path="/waste/post" element={<WasteTipWrite/>}/> {/* 폐기물 팁 게시글 작성 내용 */}
                        <Route path="/waste/edit/:id" element={<WasteTipEdit/>}/> {/* 폐기물 팁 게시글 수정 내용 */}

                        <Route path="/lifehacks" element={<LifeTip/>}/> {/* 일상 팁 */}
                        <Route path="/lifehacks/detail/:id" element={<LifeTipDetail/>}/> {/* 일상 팁 게시글 내용 */}
                        <Route path="/lifehacks/post" element={<LifeTipWrite/>}/> {/* 일상 팁 게시글 작성 */}
                        <Route path="/lifehacks/edit/:id" element={<LifeTipEdit/>}/> {/* 일상 팁 게시글 작성 */}
                    </Routes>
                </RouteAuthProvider>
            </SocketProvider>
        </>
    )
}

export default TipRouter;