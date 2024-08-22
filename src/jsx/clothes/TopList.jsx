import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../css/clothes/topList.module.css';
import Footer from '../../jsx/fix/Footer.jsx';
import apiClient from '../../config/axiosConfig';
import { DetermineHowWash } from "./DetermineHowWash.jsx";

const TopList = () => {
    const navigate = useNavigate();
    const [clothes, setClothes] = useState([]);
    const [modalData, setModalData] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [currentEdit, setCurrentEdit] = useState(null);

    // JWT 토큰에서 user_id 추출 함수
    const parseJwt = (token) => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error("JWT 토큰 파싱 중 오류 발생:", error);
            return null;
        }
    };

    const getUserIdFromToken = () => {
        const access = localStorage.getItem('access');
        if (!access) {
            console.error("토큰이 없습니다. 로그인 페이지로 이동합니다.");
            navigate('/login');
            return null;
        }

        const decodedToken = parseJwt(access);
        return decodedToken ? decodedToken.userId : null;
    };

    useEffect(() => {
        const fetchClothes = async () => {
            const userId = getUserIdFromToken();
            if (!userId) {
                console.error('User ID is null or undefined. Cannot proceed with fetching clothes data.');
                return;
            }

            try {
                const response = await apiClient.get(`/ware/items`, {
                    params: {
                        user_id: userId,
                        category: 'top'  // 상의 요청
                    },
                    withCredentials: true
                });
                setClothes(response.data);
            } catch (error) {
                console.error('데이터를 불러오는 중 오류 발생:', error.message);
            }

        };

        fetchClothes();
    }, []);

    const openModal = (cloth) => {
        const clothHowWash = DetermineHowWash(cloth.clothType, cloth.clothMaterial);
        setModalData({ ...cloth, clothHowWash });
        setEditMode(false);
        setCurrentEdit({ ...cloth, clothHowWash });
    };

    const closeModal = () => {
        document.getElementById("myModal").style.display = "none";
        setModalData(null);
        setCurrentEdit(null);
    };

    const handleClickOutside = (event) => {
        if (event.target.id === "myModal") {
            closeModal();
        }
    };

    const handleEdit = () => {
        setEditMode(true);
    };

    const handleSave = async () => {
        try {
            await apiClient.put(`/ware/items/${currentEdit.clothId}`, currentEdit);
            setClothes(clothes.map(cloth => cloth.clothId === currentEdit.clothId ? currentEdit : cloth));
            closeModal();
        } catch (error) {
            console.error('수정 중 오류 발생:', error);
        }
    };

    const handleDelete = async () => {
        try {
            await apiClient.delete(`/ware/items/${currentEdit.clothId}`);
            const fileName = currentEdit.imageUrl.split('/').pop();
            await apiClient.delete(`/files/delete?fileName=${encodeURIComponent(fileName)}`);
            setClothes(clothes.filter(cloth => cloth.clothId !== currentEdit.clothId));
            closeModal();
        } catch (error) {
            console.error('삭제 중 오류 발생:', error);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setCurrentEdit({ ...currentEdit, [name]: value });
    };

    const getOptions = () => {
        return ['반팔', '긴팔', '셔츠', '민소매', '카라티', '니트'];
    };

    const getColorOptions = () => {
        return ['검정', '회색', '흰색','베이지','초록','빨강','네이비','노랑','주황','핑크','기타'];
    };

    const getMaterialOptions = () => {
        return ['면', '폴리에스터', '나일론', '울', '실크', '가죽'];
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
                        src={cloth.imageUrl || '/lib/상의1.svg'}
                        alt={cloth.clothName || `상의 ${index + 1}`}
                        onClick={() => openModal(cloth)}
                    />
                ))}
            </div>

            {modalData && (
                <div id="myModal" className={styles.modal} onClick={handleClickOutside}>
                    <div className={styles.modalContent}>
                        <span className={styles.close} onClick={closeModal}>&times;</span>
                        {!editMode ? (
                            <>
                                <h2>{modalData.clothName}</h2>
                                <div className={styles.clothInfo}>
                                    <h4>종류</h4>
                                    <p>{modalData.clothType}</p>
                                </div>
                                <div className={styles.clothInfo}>
                                    <h4>색상</h4>
                                    <p>{modalData.clothColor}</p>
                                </div>
                                <div className={styles.clothInfo}>
                                    <h4>소재</h4>
                                    <p>{modalData.clothMaterial}</p>
                                </div>
                                <div className={styles.clothInfo}>
                                    <h4>계절</h4>
                                    <p>{modalData.clothSeason}</p>
                                </div>
                                <div className={styles.clothInfo}>
                                    <h4>세탁 방법</h4>
                                    <p>{modalData.clothHowWash}</p>
                                </div>
                                <div className={styles.clothInfo}>
                                    <h4>커스텀 태그</h4>
                                    <p>{modalData.clothCustomTag}</p>
                                </div>
                                <div className={styles.buttons}>
                                    <button onClick={handleEdit}>수정</button>
                                    <button onClick={handleDelete} className={styles.deleteButton}>삭제</button>
                                </div>
                            </>
                        ) : (
                            <>
                                <h2>수정 모드</h2>
                                <div className={styles.tags}>
                                <div className={styles.tag}>
                                    <label htmlFor="clothName">옷 이름</label>
                                    <input
                                        type="text"
                                        id="clothName"
                                        name="clothName"
                                        value={currentEdit.clothName}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className={styles.tag}>
                                    <label htmlFor="clothType">종류</label>
                                    <select
                                        id="clothType"
                                        name="clothType"
                                        value={currentEdit.clothType}
                                        onChange={handleChange}
                                    >
                                        {getOptions().map(option => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className={styles.tag}>
                                    <label htmlFor="clothColor">색상</label>
                                    <select
                                        id="clothColor"
                                        name="clothColor"
                                        value={currentEdit.clothColor}
                                        onChange={handleChange}
                                    >
                                        {getColorOptions().map(color => (
                                            <option key={color} value={color}>{color}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className={styles.tag}>
                                    <label htmlFor="clothMaterial">소재</label>
                                    <select
                                        id="clothMaterial"
                                        name="clothMaterial"
                                        value={currentEdit.clothMaterial}
                                        onChange={handleChange}
                                    >
                                        {getMaterialOptions().map(material => (
                                            <option key={material} value={material}>{material}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className={styles.tag}>
                                    <label htmlFor="clothSeason">계절</label>
                                    <select
                                        id="clothSeason"
                                        name="clothSeason"
                                        value={currentEdit.clothSeason}
                                        onChange={handleChange}
                                    >
                                        <option value="SUMMER">여름</option>
                                        <option value="SPRING_FALL">봄/가을</option>
                                        <option value="WINTER">겨울</option>
                                    </select>
                                </div>
                                <div className={styles.tag}>
                                    <label htmlFor="clothHowWash">세탁방법</label>
                                    <input
                                        type="text"
                                        id="clothHowWash"
                                        name="clothHowWash"
                                        value={currentEdit.clothHowWash}
                                        readOnly
                                    />
                                </div>
                                    <div className={styles.tag}>
                                        <label htmlFor="clothCustomTag">커스텀 태그</label>
                                        <input
                                            type="text"
                                            id="clothCustomTag"
                                            name="clothCustomTag"
                                            value={currentEdit.clothCustomTag}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className={styles.buttons}>
                                    <button onClick={handleSave}>저장</button>
                                    <button onClick={closeModal}>취소</button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
            <Footer/>
        </div>
    );
};

export default TopList;
