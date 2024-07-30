import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../css/clothes/topList.module.css';
import Footer from '../../jsx/fix/Footer.jsx';

const TopList = () => {
    const navigate = useNavigate();
    const [modalData, setModalData] = useState(null);

    const openModal = (title, type, color, material, season, howWash) => {
        setModalData({ title, type, color, material, season, howWash });
        document.getElementById("myModal").style.display = "block";
    };

    const closeModal = () => {
        document.getElementById("myModal").style.display = "none";
        setModalData(null);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <img src="public/lib/back.svg" alt="back" onClick={() => navigate('/closetRoom')} />
                <h2>Top</h2>
            </div>
            <div className={styles.itemList}>
                {Array.from({ length: 8 }).map((_, index) => (
                    <img
                        key={index}
                        src="public/lib/상의1.svg"
                        alt={`옷 ${index + 1}`}
                        onClick={() => openModal(`옷 ${index + 1}`, '반팔', '초록, 검정, 회색, 흰색', '면', '여름', '세탁기')}
                    />
                ))}
            </div>

            {/* Modal */}
            {modalData && (
                <div id="myModal" className={styles.modal}>
                    <div className={styles.modalContent}>
                        <span className={styles.close} onClick={closeModal}>&times;</span>
                        <h2>{modalData.title}</h2>
                        <p>종류: {modalData.type}</p>
                        <p>색상: {modalData.color}</p>
                        <p>소재: {modalData.material}</p>
                        <p>계절: {modalData.season}</p>
                        <p>세탁 방법: {modalData.howWash}</p>
                    </div>
                </div>
            )}
            <Footer />
        </div>
    );
};

export default TopList;
