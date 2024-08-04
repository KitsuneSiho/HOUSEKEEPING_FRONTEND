import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../css/clothes/closetRoom.module.css';
import Footer from '../../jsx/fix/Footer.jsx';
import apiClient from '../../api/axiosConfig'; /* api 추가 */

const ClosetRoom = () => {
    const navigate = useNavigate();
    const [clothes, setClothes] = useState([]);

    useEffect(() => {
        const fetchClothes = async () => {
            try {
                const response = await apiClient.get('/ware/items');
                setClothes(response.data);
            } catch (error) {
                console.error('옷장 갱신에 실패:', error);
            }
        };

        fetchClothes();
    }, []);

    const renderCategoryItems = (category) => {
        const items = clothes.filter(cloth => cloth.category === category).slice(0, 4);
        if (items.length === 0) {
            // 기본 예시 이미지 표시
            switch (category) {
                case 'Top':
                    return (
                        <>
                            <img src="public/lib/상의1.svg" alt="Top Item 1" />
                            <img src="public/lib/상의1.svg" alt="Top Item 2" />
                            <img src="public/lib/상의1.svg" alt="Top Item 3" />
                            <img src="public/lib/상의1.svg" alt="Top Item 4" />
                        </>
                    );
                case 'Bottom':
                    return (
                        <>
                            <img src="public/lib/하의1.svg" alt="Bottom Item 1" />
                            <img src="public/lib/하의1.svg" alt="Bottom Item 2" />
                            <img src="public/lib/하의1.svg" alt="Bottom Item 3" />
                            <img src="public/lib/하의1.svg" alt="Bottom Item 4" />
                        </>
                    );
                case 'Shoes':
                    return (
                        <>
                            <img src="public/lib/신발1.svg" alt="Shoes Item 1" />
                            <img src="public/lib/신발1.svg" alt="Shoes Item 2" />
                            <img src="public/lib/신발1.svg" alt="Shoes Item 3" />
                            <img src="public/lib/신발1.svg" alt="Shoes Item 4" />
                        </>
                    );
                case 'Accessory':
                    return (
                        <>
                            <img src="public/lib/악세사리1.svg" alt="Accessory Item 1" />
                            <img src="public/lib/악세사리1.svg" alt="Accessory Item 2" />
                            <img src="public/lib/악세사리1.svg" alt="Accessory Item 3" />
                            <img src="public/lib/악세사리1.svg" alt="Accessory Item 4" />
                        </>
                    );
                default:
                    return null;
            }
        }
        return items.map((item, index) => (
            <img key={index} src={item.imageUrl} alt={`${category} Item ${index + 1}`} />
        ));
    };

    {/* clothes 배열에서 각 cloth 객체를 순회하면서, category 필드가 입력받은 category 값과 일치하는 객체들만 필터링
                        예를 들어, category 값이 'Top'이면 clothes 배열에서 카테고리가 'Top'인 옷들만 남김
    .slice(0, 4) :  필터링된 결과 배열에서 최대 4개의 항목만 선택하여, 최대의 4개의 아이템만 보여줌
                    */}


    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>Dress Room</h2>
            </div>
            <div className={styles.closetRoomHeader}>
                <h3 onClick={() => navigate('/uploadCloset')}>
                    등록하기
                    <img src="public/lib/카메라.svg" alt="카메라 아이콘" />
                </h3>
                <h3 onClick={() => navigate('/recommendCloset')}>
                    추천받기
                    <img src="public/lib/따봉.svg" alt="따봉 아이콘" />
                </h3>
            </div>

            <div className={styles.categories}>
                <div className={styles.category}>
                    <h4>Top</h4>
                    <div className={styles.itemsGrid} onClick={() => navigate('/topList')}>
                        {renderCategoryItems('Top')}
                    </div>
                </div>

                <div className={styles.category}>
                    <h4>Bottom</h4>
                    <div className={styles.itemsGrid}>
                        {renderCategoryItems('Bottom')}
                    </div>
                </div>
            </div>
            <div className={styles.categories}>
                <div className={styles.category}>
                    <h4>Shoes</h4>
                    <div className={styles.itemsGrid}>
                        {renderCategoryItems('Shoes')}
                    </div>
                </div>

                <div className={styles.category}>
                    <h4>Accessory</h4>
                    <div className={styles.itemsGrid}>
                        {renderCategoryItems('Accessory')}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default ClosetRoom;
