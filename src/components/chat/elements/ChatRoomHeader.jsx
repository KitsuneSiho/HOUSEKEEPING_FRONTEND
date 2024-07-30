import styles from "../../../css/chat/chatRoom.module.css";
import PropTypes from "prop-types";
import {useNavigate} from "react-router-dom";
import {useState} from "react";

const ChatRoomHeader = ({chatRoomName}) => {

    const [menuShow, setMenuShow] = useState(false);
    const navigate = useNavigate();

    return (
        <>
            <div className={styles.header}>
                <img
                    className={styles.backIcon}
                    src="/lib/back.svg"
                    alt="back"
                    onClick={() => navigate('/chat')}
                />
                <h2>{chatRoomName}</h2>
                <img
                    className={styles.menuIcon}
                    src="/lib/menu.png"
                    alt="menu"
                    onClick={() => setMenuShow(!menuShow)}
                />
            </div>
            <div className={`${styles.menuArea} ${menuShow ? styles.show : ""}`}>
                <img
                    className={styles.menuIcon}
                    src="/lib/menu.png"
                    alt="menu"
                    onClick={() => setMenuShow(!menuShow)}
                />
                {/* 메뉴 내용 추가 */}
                <div>
                    <h3>Menu</h3>
                    <ul>
                        <li onClick={() => navigate('/settings')}>Settings</li>
                        <li onClick={() => navigate('/profile')}>Profile</li>
                        <li onClick={() => navigate('/logout')}>Logout</li>
                    </ul>
                </div>
            </div>
        </>
    )
}

ChatRoomHeader.propTypes = {
    chatRoomName: PropTypes.string,
}

export default ChatRoomHeader