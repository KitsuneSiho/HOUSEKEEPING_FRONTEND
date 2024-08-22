import {Route, Routes} from "react-router-dom";
import Calendar from "../jsx/calendar/Calendar.jsx";
import Routine from "../jsx/routine/Routine.jsx";
import RoutineEdit from "../jsx/routine/RoutineEdit.jsx";
import DailyRoutineInfo from "../jsx/routine/DailyRoutineInfo.jsx";
import WeeklyRoutineInfo from "../jsx/routine/WeeklyRoutineInfo.jsx";
import MonthlyRoutineInfo from "../jsx/routine/MonthlyRoutineInfo.jsx";
import RouteAuthProvider from "../contexts/RouteAuthContext.jsx";
import {SocketProvider} from "../contexts/SocketContext.jsx";
import ChatAlarm from "../pages/chat/ChatAlarm.jsx";

function RecommendMonthlyRoutine() {
    return null;
}

const RoutineRouter = () => {

    return (
        <>
            {/* 루틴 관련 */}
            {/* /routine */}
            <SocketProvider>
                <RouteAuthProvider>
                    <Routes>
                        <Route path="/" element={<Routine/>}/> {/* 루틴 메인 화면 */}
                        <Route path="/calendar" element={<Calendar/>}/> {/* 달력 */}
                        <Route path="/edit" element={<RoutineEdit/>}/> {/* 적용 루틴 수정 화면 */}

                        {/* 추천 루틴 */}
                        {/* <Route path="/recommend/daily" element={<RecommendDailyRoutine/>}/> {/* 일간 루틴 */}
                        {/*<Route path="/recommend/weekly" element={<RecommendWeeklyRoutine/>}/> {/* 주간 루틴 */}
                        <Route path="/recommend/monthly" element={<RecommendMonthlyRoutine/>}/> {/* 월간 루틴 */}

                        {/* 기존 루틴 정보 보기 */}
                        <Route path="/daily/:groupName" element={<DailyRoutineInfo/>}/> {/* 일간 루틴 */}
                        <Route path="/weekly/:groupName" element={<WeeklyRoutineInfo/>}/> {/* 주간 루틴 */}
                        <Route path="/monthly/:groupName" element={<MonthlyRoutineInfo/>}/> {/* 월간 루틴 */}
                    </Routes>
                    <ChatAlarm/>
                </RouteAuthProvider>
            </SocketProvider>
        </>
    )
}

export default RoutineRouter;