import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from '../../css/clothes/uploadClosetCheck.module.css';
import Footer from '../../jsx/fix/Footer.jsx';
import apiClient from '../../config/axiosConfig';
import { DetermineHowWash } from "./DetermineHowWash.jsx";

const UploadClosetCheck = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [fileUrl, setFileUrl] = useState('');
    const [isSaved, setIsSaved] = useState(false);
    const [category, setCategory] = useState('outer'); // 기본값을 'outer'로 설정
    const [clothDetails, setClothDetails] = useState({
        clothId: "1",
        clothName: '새 옷',
        clothType: '',
        clothColor: '초록',
        clothMaterial: '면',
        clothSeason: 'SUMMER',
        clothHowWash : '일반 세탁',
        clothCustomTag: ''
    });

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
        // clothType 또는 clothMaterial이 변경될 때 세탁 방법 설정
        if (clothDetails.clothType && clothDetails.clothMaterial) {
            setClothDetails((prevDetails) => ({
                ...prevDetails,
                clothHowWash: DetermineHowWash(prevDetails.clothType, prevDetails.clothMaterial) || "Unknown",
            }));
        }
    }, [clothDetails.clothType, clothDetails.clothMaterial]);


    useEffect(() => {
        if (location.state && location.state.fileUrl) {
            setFileUrl(location.state.fileUrl);
        }
    }, [location.state]);

    useEffect(() => {
        if (category) {
            const defaultType = getOptions(category)[0] || '';
            setClothDetails(prevDetails => ({ ...prevDetails, clothType: defaultType }));
        }
    }, [category]);

    const handleCategoryChange = (event) => {
        const selectedCategory = event.target.value;
        setCategory(selectedCategory);
    };

    const handleInputChange = (event) => {
        const { id, value } = event.target;
        setClothDetails({ ...clothDetails, [id]: value });
    };

    const handleSave = async () => {
        const userId = getUserIdFromToken(); // JWT 토큰에서 userId 추출
        if (!userId) {
            console.error('User ID is null or undefined. Cannot proceed with saving cloth data.');
            return;
        }

        const clothData = {
            ...clothDetails,
            userId: userId,
            imageUrl: fileUrl,
            clothHowWash: clothDetails.clothHowWash
        };

        console.log('Saving cloth data:', clothData); // 전송 전에 데이터 확인


        try {
            const response = await apiClient.post('/ware/items', clothData);
            console.log('Cloth saved:', response.data);
            setIsSaved(true); // 이미지가 저장된 것으로 간주
            navigate('/closet'); // 저장 후 이동
        } catch (error) {
            console.error('옷 정보 저장 실패:', error);
        }
    };

    const getOptions = (category) => {
        switch (category) {
            case 'outer':
                return ['후드 집업', '가디건', '코트', '패딩', '바람막이'];
            case 'top':
                return ['반팔', '긴팔', '셔츠', '민소매', '카라티', '니트'];
            case 'bottom':
                return ['반바지', '긴바지', '원피스', '스커트'];
            case 'shoes':
                return ['운동화', '스니커즈', '구두', '샌들/슬리퍼'];
            case 'bag':
                return ['백팩', '크로스백', '토드백', '숄더백', '웨이스트백'];
            case 'accessory':
                return ['모자', '선글라스', '양말'];
            default:
                return [];
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <img className={styles.back} src="/lib/back.svg" alt="back" onClick={() => navigate('/closet/register')} />
                <h2>옷 등록</h2>
                <h3 onClick={handleSave}>등록</h3>
            </div>
            <div className={styles.closetCheckImg}>
                {fileUrl && <img src={fileUrl} alt="Clothing Item" />}
            </div>
            <div className={styles.tags}>
                <div className={styles.tag}>
                    <label htmlFor="category">카테고리</label>
                    <select id="category" value={category} onChange={handleCategoryChange}>
                        <option value="outer">아우터</option>
                        <option value="top">상의</option>
                        <option value="bottom">하의</option>
                        <option value="shoes">신발</option>
                        <option value="bag">가방</option>
                        <option value="accessory">악세사리</option>
                    </select>
                </div>
                {category && (
                    <div className={styles.tag}>
                        <label htmlFor="clothType">종류</label>
                        <select id="clothType" value={clothDetails.clothType} onChange={handleInputChange}>
                            {getOptions(category).map(option => (
                                <option key={option} value={option}>{option}</option>
                             ))}
                        </select>
                    </div>
                )}
                <div className={styles.tag}>
                    <label htmlFor="clothColor">색상</label>
                    <select id="clothColor" value={clothDetails.clothColor} onChange={handleInputChange}>
                        <option value="검정">검정</option>
                        <option value="회색">회색</option>
                        <option value="흰색">흰색</option>
                        <option value="베이지">베이지</option>
                        <option value="초록">초록</option>
                        <option value="빨강">빨강</option>
                        <option value="네이비">네이비</option>
                        <option value="노랑">노랑</option>
                        <option value="주황">주황</option>
                        <option value="핑크">핑크</option>
                        <option value="기타">기타</option>
                    </select>
                </div>
                <div className={styles.tag}>
                    <label htmlFor="clothMaterial">소재</label>
                    <select id="clothMaterial" value={clothDetails.clothMaterial} onChange={handleInputChange}>
                        <option value="면">면</option>
                        <option value="폴리에스터">폴리에스터</option>
                        <option value="나일론">나일론</option>
                        <option value="울">울</option>
                        <option value="실크">실크</option>
                        <option value="가죽">가죽</option>

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
                    <input type="text" id="clothCustomTag" value={clothDetails.clothCustomTag}
                           onChange={handleInputChange}/>
                </div>
                <input type="hidden" id="clothHowWash" value={clothDetails.clothHowWash}/>
            </div>
            <Footer/>
        </div>
    );
};

export default UploadClosetCheck;
