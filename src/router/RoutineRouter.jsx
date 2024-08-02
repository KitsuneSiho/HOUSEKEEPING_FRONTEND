import {Route, Routes} from "react-router-dom";
import Calendar from "../jsx/calendar/Calendar.jsx";
import Routine from "../jsx/routine/Routine.jsx";
import RoutineEdit from "../jsx/routine/RoutineEdit.jsx";
import DailyRoutineInfo from "../jsx/routine/DailyRoutineInfo.jsx";
import WeeklyRoutineInfo from "../jsx/routine/WeeklyRoutineInfo.jsx";
import MonthlyRoutineInfo from "../jsx/routine/MonthlyRoutineInfo.jsx";

const RoutineRouter = () => {

    return (
        <>
            {/* 루틴 관련 */}
            {/* /routine */}
            <Routes>
                <Route path="/" element={<Routine/>}/> {/* 루틴 메인 화면 */}
                <Route path="/calendar" element={<Calendar/>}/> {/* 달력 */}
                <Route path="/edit" element={<RoutineEdit/>}/> {/* 적용 루틴 수정 화면 */}
                <Route path="/daily" element={<DailyRoutineInfo/>}/> {/* 일간 루틴 */}
                <Route path="/weekly" element={<WeeklyRoutineInfo/>}/> {/* 주간 루틴 */}
                <Route path="/monthly" element={<MonthlyRoutineInfo/>}/> {/* 월간 루틴 */}
            </Routes>
        </>
    )
}

export default RoutineRouter;