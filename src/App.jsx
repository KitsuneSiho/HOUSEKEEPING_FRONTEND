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

function App() {

    return (
        <div>
            <Router>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                </Routes>
            </Router>
        </div>
    )
}

export default App
