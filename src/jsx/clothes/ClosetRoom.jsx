import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../css/clothes/closetRoom.module.css';
import Footer from '../../jsx/fix/Footer.jsx';
import apiClient from '../../config/axiosConfig';

const ClosetRoom = () => {
    const navigate = useNavigate();
    const [clothes, setClothes] = useState([]);

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
            const userId = getUserIdFromToken(); // JWT 토큰에서 userId 추출
            if (!userId) {
                console.error('User ID is null or undefined. Cannot proceed with fetching clothes data.');
                return;
            }

            try {
                const response = await apiClient.get(`/ware/items?user_id=${userId}`);
                setClothes(response.data);
            } catch (error) {
                console.error('옷장 갱신에 실패:', error);
            }
        };

        fetchClothes();
    }, []);

    const renderCategoryItems = (categories) => {
        // 각 카테고리별 아이템을 필터링하고, 최대 4개만 추출
        const items = categories.flatMap(category =>
            clothes.filter(cloth => cloth.clothType === category)
        ).slice(0, 4);

        const defaultItemsCount = 4 - items.length;
        const defaultItems = Array.from({ length: defaultItemsCount }, (_, i) => (
            <img key={`default-${i}`} src={getDefaultImage(categories[0])} alt="" />
        ));

        return (
            <>
                {items.map((item, index) => (
                    <img key={index} src={item.imageUrl || getDefaultImage(item.clothType)} alt={`${item.clothType} Item ${index + 1}`} />
                ))}
                {defaultItems}
            </>
        );
    };

    // 카테고리별 기본 이미지를 반환하는 함수
    const getDefaultImage = (category) => {
        switch (category) {
            case '후드 집업':
            case '패딩':
            case '가디건':
            case '코트':
            case '바람막이':
                return '';
            case '반팔':
            case '긴팔':
            case '셔츠':
            case '민소매':
            case '카라티':
            case '니트':
                return '';
            case '반바지':
            case '긴바지':
            case '원피스':
            case '스커트':
                return '';
            case '운동화':
            case '스니커즈':
            case '구두':
            case '샌들/슬리퍼':
                return '';
            case '백팩':
            case '크로스백':
                return '';
            case '모자':
            case '양말':
            case '선글라스':
                return '';
            default:
                return ''; // 기본 이미지
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>Dress Room</h2>
            </div>
            <div className={styles.closetRoomHeader}>
                <h3 onClick={() => navigate('/closet/register')}>
                    등록하기
                    <img src="/lib/카메라.svg" alt="카메라 아이콘"/>
                </h3>
                <h3 onClick={() => navigate('/closet/recommend')}>
                    추천받기
                    <img src="/lib/따봉.svg" alt="따봉 아이콘"/>
                </h3>
            </div>

            <div className={styles.categories}>
                <div className={styles.category}>
                    <h4>Outer</h4>
                    <div className={styles.itemsGrid} onClick={() => navigate('/closet/outer')}>
                        {renderCategoryItems(['후드 집업', '패딩', '가디건', '코트', '바람막이'])}
                    </div>
                </div>
                <div className={styles.category}>
                    <h4>Top</h4>
                    <div className={styles.itemsGrid} onClick={() => navigate('/closet/top')}>
                        {renderCategoryItems(['반팔', '긴팔', '셔츠', '민소매', '카라티', '니트'])}
                    </div>
                </div>
            </div>
            <div className={styles.categories}>
                <div className={styles.category}>
                    <h4>Bottom</h4>
                    <div className={styles.itemsGrid} onClick={() => navigate('/closet/bottom')}>
                        {renderCategoryItems(['반바지', '긴바지', '원피스', '스커트'])}
                    </div>
                </div>
                <div className={styles.category}>
                    <h4>Shoes</h4>
                    <div className={styles.itemsGrid} onClick={() => navigate('/closet/shoes')}>
                        {renderCategoryItems(['운동화', '스니커즈', '구두', '샌들/슬리퍼'])}
                    </div>
                </div>
            </div>
            <div className={styles.categories}>
                <div className={styles.category}>
                    <h4>Bag</h4>
                    <div className={styles.itemsGrid} onClick={() => navigate('/closet/bag')}>
                        {renderCategoryItems(['백팩', '크로스백','토드백', '숄더백', '웨이스트백'])}
                    </div>
                </div>
                <div className={styles.category}>
                    <h4>Accessory</h4>
                    <div className={styles.itemsGrid} onClick={() => navigate('/closet/accessory')}>
                        {renderCategoryItems(['모자', '양말', '선글라스'])}
                    </div>
                </div>
            </div>

            <Footer/>
        </div>
    );
};

export default ClosetRoom;
