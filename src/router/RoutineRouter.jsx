import {Route, Routes} from "react-router-dom";
import Calendar from "../jsx/calendar/Calendar.jsx";
import Routine from "../jsx/routine/Routine.jsx";
import RoutineEdit from "../jsx/routine/RoutineEdit.jsx";
import DailyRoutineInfo from "../jsx/routine/DailyRoutineInfo.jsx";
import WeeklyRoutineInfo from "../jsx/routine/WeeklyRoutineInfo.jsx";
import MonthlyRoutineInfo from "../jsx/routine/MonthlyRoutineInfo.jsx";
import CreateDailyRoutine from "../jsx/routine/CreateDailyRoutine.jsx";
import CreateWeeklyRoutine from "../jsx/routine/CreateWeeklyRoutine.jsx";
import CreateMonthlyRoutine from "../jsx/routine/CreateMonthlyRoutine.jsx";

const RoutineRouter = () => {

    return (
        <>
            {/* 루틴 관련 */}
            {/* /routine */}
            <Routes>
                <Route path="/" element={<Routine/>}/> {/* 루틴 메인 화면 */}
                <Route path="/calendar" element={<Calendar/>}/> {/* 달력 */}
                <Route path="/edit" element={<RoutineEdit/>}/> {/* 적용 루틴 수정 화면 */}

                {/* 사용자 정의 루틴 */}
                <Route path="/create/daily/:groupName" element={<CreateDailyRoutine/>}/> {/* 일간 루틴 */}
                <Route path="/create/weekly/:groupName" element={<CreateWeeklyRoutine/>}/> {/* 주간 루틴 */}
                <Route path="/create/monthly/:groupName" element={<CreateMonthlyRoutine/>}/> {/* 월간 루틴 */}

                {/* 기존 루틴 정보 보기 */}
                <Route path="/daily/:groupName" element={<DailyRoutineInfo/>}/> {/* 일간 루틴 */}
                <Route path="/weekly/:groupName" element={<WeeklyRoutineInfo/>}/> {/* 주간 루틴 */}
                <Route path="/monthly/:groupName" element={<MonthlyRoutineInfo/>}/> {/* 월간 루틴 */}
            </Routes>
        </>
    )
}

export default RoutineRouter;