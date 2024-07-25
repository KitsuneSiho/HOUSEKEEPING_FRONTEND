// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Calendar from './components/Calendar.jsx';
import Guestbook from './components/Guestbook.jsx'; // 방명록 컴포넌트 추가

const App = () => {
    return (
        <Router>
            <div>
                <nav>
                    <ul>
                        <li>
                            <Link to="/">Calendar</Link>
                        </li>
                        <li>
                            <Link to="/guestbook">Guestbook</Link> {/* 방명록 페이지 링크 추가 */}
                        </li>
                    </ul>
                </nav>
                <Routes>
                    <Route path="/" element={<Calendar />} />
                    <Route path="/guestbook" element={<Guestbook />} /> {/* 방명록 페이지 라우트 추가 */}
                </Routes>
            </div>
        </Router>
    );
};

export default App;
