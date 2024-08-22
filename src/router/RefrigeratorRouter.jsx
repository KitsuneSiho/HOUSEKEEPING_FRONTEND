import {Route, Routes} from "react-router-dom";
import LivingRoom from "../jsx/livingRoom/LivingRoom.jsx";
import UploadFood from "../jsx/livingRoom/UploadFood.jsx";
import UploadFoodListCheck from "../jsx/livingRoom/UploadFoodListCheck.jsx";
import SearchRecipe from "../jsx/livingRoom/SearchRecipe.jsx";
import RecommendRecipe from "../jsx/livingRoom/RecommendRecipe.jsx";
import FoodList from "../jsx/livingRoom/FoodList.jsx";
import RouteAuthProvider from "../contexts/RouteAuthContext.jsx";
import {SocketProvider} from "../contexts/SocketContext.jsx";
import ChatAlarm from "../pages/chat/ChatAlarm.jsx";

const RefrigeratorRouter = () => {

    return (
        <>
            {/* 냉장고 관련 기능 */}
            {/* /refrigerator */}
            <SocketProvider>
                <RouteAuthProvider>
                    <Routes>
                        <Route path="/" element={<LivingRoom/>}/> {/* 냉장고 메인 화면 */}
                        <Route path="/list/:category" element={<FoodList/>}/> {/* 재료 목록(카테고리별로 파일 추가 만들어야됨) */}
                        <Route path="/register" element={<UploadFood/>}/> {/* 냉장고 재료 등록(카메라만있음) */}
                        <Route path="/register/check" element={<UploadFoodListCheck/>}/> {/* 냉장고 재료 등록 확인 화면 */}
                        <Route path="/search" element={<SearchRecipe/>}/> {/* 레시피 검색 */}
                        <Route path="/recommend" element={<RecommendRecipe/>}/> {/* 레시피 추천(검색한거 결과나오는화면 */}
                    </Routes>
                    <ChatAlarm/>
                </RouteAuthProvider>
            </SocketProvider>
        </>
    )
}

export default RefrigeratorRouter;