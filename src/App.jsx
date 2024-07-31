import {Route, BrowserRouter as Router, Routes, Link} from "react-router-dom";
import Home from "./components/Home.jsx";
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
import ChatList from "./jsx/chat/ChatList.jsx";
import ChatRoom from "./jsx/chat/ChatRoom.jsx";
import CreateChat from "./jsx/chat/CreateChat.jsx";
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
import MyPage from "./jsx/myPage/MyPage.jsx";
import MyInfo from "./jsx/myPage/MyInfo.jsx";
import FriendList from "./jsx/myPage/FriendList.jsx";
import GuestBook from "./jsx/myPage/GuestBook.jsx";
import Setting from "./jsx/myPage/Setting.jsx";
import DeleteUser from "./jsx/myPage/DeleteUser.jsx";
import ClosetRoom from "./jsx/clothes/ClosetRoom.jsx";
import UploadCloset from "./jsx/clothes/UploadCloset.jsx";
import UploadClosetCheck from "./jsx/clothes/UploadClosetCheck.jsx";
import RecommendCloset from "./jsx/clothes/RecommendCloset.jsx";
import TopList from "./jsx/clothes/TopList.jsx";
import MyGuestBook from "./jsx/main/MyGuestBook.jsx";

function App() {

    return (
        <div>
            <Router>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/Footer" element={<Footer/>}/> {/* 하단바 */}
                    <Route path="/FirstMain" element={<FirstMain/>}/> {/* HouseKeeping로고만 있는 첫 화면 */}
                    <Route path="/Login" element={<Login/>}/> {/* 로그인 화면 */}
                    <Route path="/FirstLogin" element={<FirstLogin/>}/> {/* 첫 로그인시 추가 정보 입력창 */}
                    <Route path="/FirstRoomDesign" element={<FirstRoomDesign/>}/> {/* 첫 로그인시 방 디자인 화면 */}
                    <Route path="/FirstLivingRoom" element={<FirstLivingRoom/>}/> {/* 첫 로그인시 주방 디자인 화면 */}
                    <Route path="/FirstToiletRoom" element={<FirstToiletRoom/>}/> {/* 첫 로그인시 화장실 디자인 화면 */}
                    <Route path="/MainPage" element={<MainPage/>}/> {/* 메인화면 */}
                    <Route path="/MainLivingRoom" element={<MainLivingRoom/>}/> {/* 메인 주방 */}
                    <Route path="/MainToiletRoom" element={<MainToiletRoom/>}/> {/* 메인 화장실 */}
                    <Route path="/MyGuestBook" element={<MyGuestBook/>}/> {/* 내방 방명록 */}
                    <Route path="/AddFriend" element={<AddFriend/>}/> {/* 친구 추가 화면 */}
                    <Route path="/friendRoom/:userId" element={<FriendRoom />} />
                    <Route path="/visitorBoard/:userId" element={<VisitorBoard/>}/>
                    <Route path="/Calendar" element={<Calendar/>}/> {/* 달력 */}
                    <Route path="/ChatList" element={<ChatList/>}/> {/* 채팅 목록 화면 */}
                    <Route path="/ChatRoom" element={<ChatRoom/>}/> {/* 채팅방 화면 */}
                    <Route path="/CreateChat" element={<CreateChat/>}/> {/* 채팅방 생성 화면 */}
                    <Route path="/LivingRoom" element={<LivingRoom/>}/> {/* 냉장고 메인 화면 */}
                    <Route path="/UploadFood" element={<UploadFood/>}/> {/* 냉장고 재료 등록(카메라만있음) */}
                    <Route path="/UploadFoodListCheck" element={<UploadFoodListCheck/>}/> {/* 냉장고 재료 등록 확인 화면 */}
                    <Route path="/SearchRecipe" element={<SearchRecipe/>}/> {/* 레시피 검색 */}
                    <Route path="/RecommendRecipe" element={<RecommendRecipe/>}/> {/* 레시피 추천(검색한거 결과나오는화면 */}
                    <Route path="/FoodList" element={<FoodList/>}/> {/* 재료 목록(카테고리별로 파일 추가 만들어야됨) */}
                    <Route path="/Routine" element={<Routine/>}/> {/* 루틴 메인 화면 */}
                    <Route path="/RoutineEdit" element={<RoutineEdit/>}/> {/* 적용 루틴 수정 화면 */}
                    <Route path="/DailyRoutineInfo" element={<DailyRoutineInfo/>}/> {/* 일간 루틴 */}
                    <Route path="/WeeklyRoutineInfo" element={<WeeklyRoutineInfo/>}/>  {/* 주간 루틴 */}
                    <Route path="/MonthlyRoutineInfo" element={<MonthlyRoutineInfo/>}/> {/* 월간 루틴 */}
                    <Route path="/Tip" element={<Tip/>}/> {/* 팁 메인 화면 */}
                    <Route path="/RoomeTip" element={<RoomeTip/>}/> {/* 루미`s 팁 */}
                    <Route path="/RoomeTipDetail" element={<RoomeTipDetail/>}/> {/* 루미`s 팁 게시글 내용 */}
                    <Route path="/WasteTip" element={<WasteTip/>}/> {/* 폐기물 팁 */}
                    <Route path="/WasteTipDetail" element={<WasteTipDetail/>}/> {/* 폐기물 팁 게시글 내용 */}
                    <Route path="/WasteTipWrite" element={<WasteTipWrite/>}/> {/* 폐기물 팁 게시글 작성 내용 */}
                    <Route path="/LifeTip" element={<LifeTip/>}/> {/* 일상 팁 */}
                    <Route path="/LifeTipDetail" element={<LifeTipDetail/>}/> {/* 일상 팁 게시글 내용 */}
                    <Route path="/LifeTipWrite" element={<LifeTipWrite/>}/> {/* 일상 팁 게시글 작성 */}
                    <Route path="/MyPage" element={<MyPage/>}/> {/* 마이페이지 */}
                    <Route path="/MyInfo" element={<MyInfo/>}/> {/* 내정보  */}
                    <Route path="/FriendList" element={<FriendList/>}/> {/* 친구관리 */}
                    <Route path="/GuestBook" element={<GuestBook/>}/> {/* 방명록 보관함 */}
                    <Route path="/Setting" element={<Setting/>}/> {/* 설정 */}
                    <Route path="/DeleteUser" element={<DeleteUser/>}/> {/* 회원탈퇴 */}
                    <Route path="/ClosetRoom" element={<ClosetRoom/>}/> {/* 옷방 메인 화면 */}
                    <Route path="/UploadCloset" element={<UploadCloset/>}/> {/* 옷 등록(카메라만있음) */}
                    <Route path="/UploadClosetCheck" element={<UploadClosetCheck/>}/> {/* 옷 등록 확인 */}
                    <Route path="/RecommendCloset" element={<RecommendCloset/>}/> {/* 옷 추천 */}
                    <Route path="/TopList" element={<TopList/>}/> {/* 내 옷 리스트 (카테고리별 파일 만들어야됨) */}
                </Routes>
            </Router>
        </div>
    )
}

export default App
