import React, { useState, useEffect } from 'react';
import { useNavigate, useParams  } from 'react-router-dom';
import styles from '../../css/main/friendRoom.module.css'; // CSS 모듈 임포트
import Footer from '../../jsx/fix/Footer.jsx';
import { BACK_URL } from "../../Constraints.js";
import axios from "axios";

const FriendRoom = () => {
    const navigate = useNavigate();
    const {userId} = useParams(); // URL 파라미터로부터 userId를 추출


    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <img
                    src="/lib/back.svg"
                    alt="back"
                    onClick={() => navigate('/mainPage')}
                />
                <h2>님의 House</h2>
            </div>

            <div className={styles.dirtyBar}>
                <img src="/lib/오염도바.svg" alt="오염도바"/>
            </div>

            <div className={styles.roomDesign}>
                <img
                    src="/lib/왼쪽화살표.svg"
                    alt="left arrow"
                    onClick={() => navigate('')} // 필요한 경로로 설정
                />
                <img className={styles.myRoom} src="/lib/내방.png" alt="내방"/>
                <img
                    src="/lib/오른쪽화살표.svg"
                    alt="right arrow"
                    onClick={() => navigate('')} // 필요한 경로로 설정
                />
            </div>

            <div className={styles.visitorBoard}>
                <button
                    type="button"
                    onClick={() => navigate(`/visitorBoard/${userId}`)} // 수정된 부분
                />
            </div>
            <Footer />
        </div>
    );
};

export default FriendRoom;
