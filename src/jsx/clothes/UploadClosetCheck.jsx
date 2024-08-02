// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from '../../css/clothes/uploadClosetCheck.module.css';
import Footer from '../../jsx/fix/Footer.jsx';
import apiClient from '../../api/axiosConfig';
import BottomList from "./BottomList.jsx";

const UploadClosetCheck = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [fileUrl, setFileUrl] = useState('');
    const [isSaved, setIsSaved] = useState(false);
    const [clothDetails, setClothDetails] = useState({
        clothId : "1",
        clothName: '새 옷',
        clothType: '반팔',
        clothColor: '초록',
        clothSeason: 'SUMMER',
        clothCustomTag: ''
    });

    useEffect(() => {
        if (location.state && location.state.fileUrl) {
            setFileUrl(location.state.fileUrl);
        }
    }, [location.state]);

    useEffect(() => {
        const handleBeforeUnload = () => {
            if (!isSaved && fileUrl) {
                apiClient.delete('/files/delete', { params: { fileName: encodeURIComponent(fileUrl.split('/').pop()) } })
                    .then(response => console.log(response.data))
                    .catch(error => console.error('파일 삭제 실패:', error));
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            if (!isSaved && fileUrl) {
                apiClient.delete('/files/delete', { params: { fileName: encodeURIComponent(fileUrl.split('/').pop()) } })
                    .then(response => console.log(response.data))
                    .catch(error => console.error('파일 삭제 실패:', error));
            }
        };
    }, [fileUrl, isSaved]);

    const handleInputChange = (event) => {
        const { id, value } = event.target;
        setClothDetails({ ...clothDetails, [id]: value });
    };

    const handleSave = async () => {
        const clothData = { ...clothDetails, userId: 1, imageUrl: fileUrl };

        try {
            const response = await apiClient.post('/ware/items', clothData);
            console.log('Cloth saved:', response.data);
            setIsSaved(true);

            // clothType에 따라 적절한 카테고리 페이지로 이동
            if (clothDetails.clothType === '반팔' || clothDetails.clothType === '긴팔' || clothDetails.clothType === '셔츠') {
                navigate('/topList'); // '상의' 카테고리 페이지로 이동
            } else if (BottomList) {
                // 다른 카테고리 페이지로 이동
            }
        } catch (error) {
            console.error('옷 정보 저장 실패:', error);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <img className={styles.back} src="public/lib/back.svg" alt="back" onClick={() => navigate('/uploadCloset')} />
                <h2>옷 등록</h2>
                <h3 onClick={handleSave}>등록</h3>
            </div>
            <div className={styles.closetCheckImg}>
                {fileUrl && <img src={fileUrl} alt="Clothing Item" />}
            </div>
            <div className={styles.tags}>
                <div className={styles.tag}>
                    <label htmlFor="clothType">종류</label>
                    <select id="clothType" value={clothDetails.clothType} onChange={handleInputChange}>
                        <option value="반팔">반팔</option>
                        <option value="긴팔">긴팔</option>
                        <option value="셔츠">셔츠</option>
                    </select>
                </div>
                <div className={styles.tag}>
                    <label htmlFor="clothColor">색상</label>
                    <select id="clothColor" value={clothDetails.clothColor} onChange={handleInputChange}>
                        <option value="초록">초록</option>
                        <option value="검정">검정</option>
                        <option value="회색">회색</option>
                        <option value="흰색">흰색</option>
                    </select>
                </div>
                <div className={styles.tag}>
                    <label htmlFor="clothMaterial">소재</label>
                    <select id="clothMaterial" value={clothDetails.material} onChange={handleInputChange}>
                        <option value="면">면</option>
                        <option value="폴리에스터">폴리에스터</option>
                        <option value="나일론">나일론</option>
                    </select>
                </div>
                <div className={styles.tag}>
                    <label htmlFor="clothSeason">계절</label>
                    <select id="clothSeason" value={clothDetails.clothSeason} onChange={handleInputChange}>
                        <option value="SUMMER">여름</option>
                        <option value="SPRING_FALL">봄/가을</option>
                        <option value="WINTER">겨울</option>
                    </select>
                </div>
                <div className={styles.tag}>
                    <label htmlFor="clothCustomTag">커스텀 태그</label>
                    <input type="text" id="clothCustomTag" value={clothDetails.clothCustomTag} onChange={handleInputChange} />
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default UploadClosetCheck;
