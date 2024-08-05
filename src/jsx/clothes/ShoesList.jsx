import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../css/clothes/shoesList.module.css';
import Footer from '../../jsx/fix/Footer.jsx';
import apiClient from '../../api/axiosConfig';

const ShoesList = () => {
    const navigate = useNavigate();
    const [clothes, setClothes] = useState([]);
    const [modalData, setModalData] = useState(null);

    useEffect(() => {
        const fetchClothes = async () => {
            try {
                const response = await apiClient.get('/ware/items');
                const shoesClothes = response.data.filter(item =>
                    item.clothType === '운동화' || item.clothType === '스니커즈' || item.clothType === '구두' ||
                    item.clothType === '샌들/슬리퍼'
                );
                setClothes(shoesClothes);
            } catch (error) {
                console.error('신발 데이터를 불러오는 중 오류 발생:', error);
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
                <h2>Shoes</h2>
            </div>
            <div className={styles.itemList}>
                {clothes.map((cloth, index) => (
                    <img
                        key={index}
                        src={cloth.imageUrl || '/lib/신발1.svg'} // DB에서 가져온 imageUrl이 없으면 기본 이미지 사용
                        alt={cloth.clothName || `신발 ${index + 1}`}
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
            <Footer />
        </div>
    );
};

export default ShoesList;
