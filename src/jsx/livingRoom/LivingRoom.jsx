import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../css/livingRoom/livingRoom.module.css';
import Footer from '../../jsx/fix/Footer.jsx';


const LivingRoom = () => {
    const navigate = useNavigate();
    const categories = [
        { name: '전체보기', img: '/lib/전체보기.svg', route: '/foodlist/all' },
        { name: '유제품', img: '/lib/유제품.svg', route: '/foodlist/milk' },
        { name: '육류', img: '/lib/육류.svg', route: '/foodlist/meat' },
        { name: '해산물', img: '/lib/해산물.svg', route: '/foodlist/seafood' },
        { name: '채소', img: '/lib/채소.svg', route: '/foodlist/vegetable' },
        { name: '과일', img: '/lib/과일.svg', route: '/foodlist/fruit' },
        { name: '곡물, 견과류', img: '/lib/곡물견과류.svg', route: '/foodlist/nuts' },
        { name: '조미료, 향신료', img: '/lib/조미료향신료.svg', route: '/foodlist/seasoning' },
        { name: '기름, 버터', img: '/lib/기름버터.png', route: '/foodlist/oil' },
        { name: '빵, 파스타', img: '/lib/빵파스타.png', route: '/foodlist/flour' },
        { name: '음료', img: '/lib/음료.svg', route: '/foodlist/beverage' },
        { name: '기타', img: '/lib/기타.svg', route: '/foodlist/etc' },
    ];

    return (
        <div className={styles.container}>
            <div className={styles.livingRoomHeader}>
                <h3 onClick={() => navigate('/uploadFood')}>재료 등록</h3>
                <h3 onClick={() => navigate('/searchRecipe')}>레시피 검색</h3>
            </div>
            <div className={styles.categories}>
                {categories.map((category, index) => (
                    <div
                        key={index}
                        className={styles.category}
                        onClick={() => category.route && navigate(category.route)}
                    >
                        <img src={category.img} alt={category.name} />
                        <p>{category.name}</p>
                    </div>
                ))}
            </div>
            <Footer/>
        </div>
    );
};

export default LivingRoom;
