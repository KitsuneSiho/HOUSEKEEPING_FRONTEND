import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../css/clothes/topList.module.css';
import Footer from '../../jsx/fix/Footer.jsx';
import apiClient from '../../api/axiosConfig';

const TopList = () => {
    const navigate = useNavigate();
    const [clothes, setClothes] = useState([]);
    const [modalData, setModalData] = useState(null);

    useEffect(() => {
        const fetchClothes = async () => {
            try {
                const response = await apiClient.get('/ware/items');
                const topClothes = response.data.filter(item =>
                    item.clothType === '반팔' || item.clothType === '긴팔' || item.clothType === '셔츠' ||
                    item.clothType === '니트' || item.clothType === '민소매' || item.clothType === '카라티'
                );
                setClothes(topClothes);
            } catch (error) {
                console.error('옷 데이터를 불러오는 중 오류 발생:', error);
            }
        };

        fetchClothes();
    }, []);

    useEffect(() => {
        if (modalData) {
            const modalElement = document.getElementById("myModal");
            if (modalElement) {
                modalElement.style.display = "block";
            }
        }
    }, [modalData]);

    const openModal = (title, type, color, material, season, howWash) => {
        setModalData({ title, type, color, material, season, howWash });
    };

    const closeModal = () => {
        document.getElementById("myModal").style.display = "none";
        setModalData(null);
    };

    const handleClickOutside = (event) => {
        if (event.target.id === "myModal") {
            closeModal();
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <img className={styles.back} src="/lib/back.svg" alt="back" onClick={() => navigate('/closet')} />
                <h2>Top</h2>
            </div>
            <div className={styles.itemList}>
                {clothes.map((cloth, index) => (
                    <img
                        key={index}
                        src={cloth.imageUrl || '/lib/상의1.svg'} // DB에서 가져온 imageUrl이 없으면 기본 이미지 사용
                        alt={cloth.clothName || `상의 ${index + 1}`}
                        onClick={() => openModal(cloth.clothName, cloth.clothType, cloth.clothColor, cloth.material, cloth.clothSeason, '세탁기')}
                    />
                ))}
            </div>

            {/* Modal */}
            {modalData && (
                <div id="myModal" className={styles.modal} onClick={handleClickOutside}>
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
            <Footer/>
        </div>
    );
};

export default TopList;
