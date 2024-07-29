import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/fix/footer.css';

const Footer = () => {
    const navigate = useNavigate();
    const [popupVisible, setPopupVisible] = useState(false);

    const togglePopup = () => {
        setPopupVisible(prevVisible => !prevVisible);
    };

    const handleClickOutside = (event) => {
        const popup = document.getElementById('popup');
        const roomeImage = document.querySelector('.roome');

        if (popup && !popup.contains(event.target) && event.target !== roomeImage) {
            setPopupVisible(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <div>
            <div className="footer">
                <img className="routineIcon" src="public/lib/루틴아이콘.svg" alt="Routine Icon" onClick={() => navigate('/routine')} />
                <img className="calendarIcon" src="public/lib/달력아이콘.svg" alt="Calendar Icon" onClick={() => navigate('/calendar')} />
                <div className="roome-container">
                    <img className="roome" src="public/lib/루미.png" alt="Roome Icon" onClick={togglePopup} />
                </div>
                <img className="chatIcon" src="public/lib/채팅아이콘.svg" alt="Chat Icon" onClick={() => navigate('/chat')} />
                <img className="myPageIcon" src="public/lib/마이페이지아이콘.svg" alt="My Page Icon" onClick={() => navigate('/myPage')} />
            </div>

            <div id="popup" className="popup" style={{ display: popupVisible ? 'flex' : 'none' }}>
                <div className="popupBackground">
                    <img src="public/lib/반원팝업.svg" alt="Popup Background" />
                </div>
                <img className="livingRoom" src="public/lib/냉장고.svg" alt="냉장고 아이콘" onClick={() => navigate('/livingRoom')} />
                <img className="mainRoom" src="public/lib/방.svg" alt="방 아이콘" onClick={() => navigate('/mainPage')} />
                <img className="tip" src="public/lib/팁.svg" alt="팁 아이콘" onClick={() => navigate('/tip')} />
                <img className="closetRoom" src="public/lib/옷장.svg" alt="옷장 아이콘" onClick={() => navigate('/closetRoom')} />
            </div>
        </div>
    );
};

export default Footer;
