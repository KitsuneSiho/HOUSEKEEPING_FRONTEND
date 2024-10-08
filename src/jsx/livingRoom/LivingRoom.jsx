import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../css/livingRoom/livingRoom.module.css';
import Footer from '../../jsx/fix/Footer.jsx';
import {useLogin} from "../../contexts/AuthContext.jsx";


const LivingRoom = () => {
    const navigate = useNavigate();
    const categories = [
        { name: '전체보기', img: '/lib/전체보기.svg', route: '/refrigerator/list/all' },
        { name: '유제품', img: '/lib/유제품.svg', route: '/refrigerator/list/milk' },
        { name: '육류', img: '/lib/육류.svg', route: '/refrigerator/list/meat' },
        { name: '해산물', img: '/lib/해산물.svg', route: '/refrigerator/list/seafood' },
        { name: '채소', img: '/lib/채소.svg', route: '/refrigerator/list/vegetable' },
        { name: '과일', img: '/lib/과일.svg', route: '/refrigerator/list/fruit' },
        { name: '곡물, 견과류', img: '/lib/곡물견과류.svg', route: '/refrigerator/list/nuts' },
        { name: '조미료, 향신료', img: '/lib/조미료향신료.svg', route: '/refrigerator/list/seasoning' },
        { name: '기름, 버터', img: '/lib/기름버터.png', route: '/refrigerator/list/oil' },
        { name: '빵, 파스타', img: '/lib/빵파스타.png', route: '/refrigerator/list/flour' },
        { name: '음료', img: '/lib/음료.svg', route: '/refrigerator/list/beverage' },
        { name: '기타', img: '/lib/기타.svg', route: '/refrigerator/list/etc' },
    ];
    const {user} = useLogin();

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>Kitchen</h2>
            </div>
            <div className={styles.livingRoomHeader}>
                <h3 onClick={() => navigate('/refrigerator/register')}>재료 등록</h3>
                <h3 onClick={() => navigate('/refrigerator/search')}>레시피 검색</h3>
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
