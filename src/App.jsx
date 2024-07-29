import {Route, BrowserRouter as Router, Routes} from "react-router-dom";
import Home from "./components/Home.jsx";
import ModalExample from "./components/test/ModalExample.jsx";
import {ModalProvider} from "./components/context/ModalContext.jsx";
import {SocketProvider} from "./components/context/SocketContext.jsx";
import FirstMain from "./jsx/first/FirstMain.jsx";
import Login from "./jsx/first/Login.jsx";
import FirstLogin from "./jsx/first/FirstLogin.jsx";
import FirstRoomDesign from "./jsx/first/FirstRoomDesign.jsx";
import FirstLivingRoom from "./jsx/first/FirstLivingRoom.jsx";
import FirstToiletRoom from "./jsx/first/FirstToiletRoom.jsx";
import Footer from "./jsx/fix/Footer.jsx";
import MainPage from "./jsx/main/MainPage.jsx";
import MainLivingRoom from "./jsx/main/MainLivingRoom.jsx";
import MainToiletRoom from "./jsx/main/MainToiletRoom.jsx";
import AddFriend from "./jsx/main/AddFriend.jsx";
import FriendRoom from "./jsx/main/FriendRoom.jsx";
import VisitorBoard from "./jsx/main/VisitorBoard.jsx";
import Calendar from "./jsx/calendar/Calendar.jsx";
import ChatRoomList from "./components/chat/ChatRoomList.jsx";
import ChatRoom from "./components/chat/ChatRoom.jsx";
import CreateChat from "./components/chat/CreateChat.jsx";
import LivingRoom from "./jsx/livingRoom/LivingRoom.jsx";
import UploadFood from "./jsx/livingRoom/UploadFood.jsx";
import UploadFoodListCheck from "./jsx/livingRoom/UploadFoodListCheck.jsx";
import SearchRecipe from "./jsx/livingRoom/SearchRecipe.jsx";
import RecommendRecipe from "./jsx/livingRoom/RecommendRecipe.jsx";
import FoodList from "./jsx/livingRoom/FoodList.jsx";
import Routine from "./jsx/routine/Routine.jsx";
import RoutineEdit from "./jsx/routine/RoutineEdit.jsx";
import DailyRoutineInfo from "./jsx/routine/DailyRoutineInfo.jsx";
import WeeklyRoutineInfo from "./jsx/routine/WeeklyRoutineInfo.jsx";
import MonthlyRoutineInfo from "./jsx/routine/MonthlyRoutineInfo.jsx";
import Tip from "./jsx/tip/Tip.jsx";
import RoomeTip from "./jsx/tip/RoomeTip.jsx";
import RoomeTipDetail from "./jsx/tip/RoomeTipDetail.jsx";
import WasteTip from "./jsx/tip/WasteTip.jsx";
import WasteTipDetail from "./jsx/tip/WasteTipDetail.jsx";
import WasteTipWrite from "./jsx/tip/WasteTipWrite.jsx";
import LifeTip from "./jsx/tip/LifeTIp.jsx";
import LifeTipDetail from "./jsx/tip/LifeTipDetail.jsx";
import LifeTipWrite from "./jsx/tip/LifeTipWrite.jsx";
import ChatLogin from "./components/chat/ChatLogin.jsx";
import ChatRoom123 from "./jsx/chat/ChatRoom123.jsx";

function App() {

    return (
            <ModalProvider>
                <Router>
                    <Routes>
                        <Route path="/" element={<Home/>}/>
                        <Route path="/Footer" element={<Footer/>}/>
                        <Route path="/FirstMain" element={<FirstMain/>}/>
                        <Route path="/Login" element={<Login/>}/>
                        <Route path="/FirstLogin" element={<FirstLogin/>}/>
                        <Route path="/FirstRoomDesign" element={<FirstRoomDesign/>}/>
                        <Route path="/FirstLivingRoom" element={<FirstLivingRoom/>}/>
                        <Route path="/FirstToiletRoom" element={<FirstToiletRoom/>}/>
                        <Route path="/MainPage" element={<MainPage/>}/>
                        <Route path="/MainLivingRoom" element={<MainLivingRoom/>}/>
                        <Route path="/MainToiletRoom" element={<MainToiletRoom/>}/>
                        <Route path="/AddFriend" element={<AddFriend/>}/>
                        <Route path="/FriendRoom" element={<FriendRoom/>}/>
                        <Route path="/VisitorBoard" element={<VisitorBoard/>}/>
                        <Route path="/Calendar" element={<Calendar/>}/>
                        <Route path="/LivingRoom" element={<LivingRoom/>}/>
                        <Route path="/UploadFood" element={<UploadFood/>}/>
                        <Route path="/UploadFoodListCheck" element={<UploadFoodListCheck/>}/>
                        <Route path="/SearchRecipe" element={<SearchRecipe/>}/>
                        <Route path="/RecommendRecipe" element={<RecommendRecipe/>}/>
                        <Route path="/FoodList" element={<FoodList/>}/>
                        <Route path="/Routine" element={<Routine/>}/>
                        <Route path="/RoutineEdit" element={<RoutineEdit/>}/>
                        <Route path="/DailyRoutineInfo" element={<DailyRoutineInfo/>}/>
                        <Route path="/WeeklyRoutineInfo" element={<WeeklyRoutineInfo/>}/>
                        <Route path="/MonthlyRoutineInfo" element={<MonthlyRoutineInfo/>}/>
                        <Route path="/Tip" element={<Tip/>}/>
                        <Route path="/RoomeTip" element={<RoomeTip/>}/>
                        <Route path="/RoomeTipDetail" element={<RoomeTipDetail/>}/>
                        <Route path="/WasteTip" element={<WasteTip/>}/>
                        <Route path="/WasteTipDetail" element={<WasteTipDetail/>}/>
                        <Route path="/WasteTipWrite" element={<WasteTipWrite/>}/>
                        <Route path="/LifeTip" element={<LifeTip/>}/>
                        <Route path="/LifeTipDetail" element={<LifeTipDetail/>}/>
                        <Route path="/LifeTipWrite" element={<LifeTipWrite/>}/>

                        {/* 채팅 */}
                        <Route path="/chatlogin" element={
                            <SocketProvider>
                                <ChatLogin/>
                            </SocketProvider>}/>
                        <Route path="/chat" element={
                            <SocketProvider>
                                <ChatRoomList/>
                            </SocketProvider>}/>
                        <Route path="/chat/:chatRoomId/:chatRoomName" element={
                            <SocketProvider>
                                <ChatRoom/>
                            </SocketProvider>}/>
                        <Route path="/chat/create" element={
                            <SocketProvider>
                                <CreateChat/>
                            </SocketProvider>}/>

                        {/*    테스트 컴포넌트를 라우팅하는 부분입니다*/}
                        <Route path="/test/modal" element={<ModalExample/>}/>
                        <Route path="/test/chat/123" element={<ChatRoom123/>}/>
                    </Routes>
                </Router>
            </ModalProvider>
    )
}

export default App
