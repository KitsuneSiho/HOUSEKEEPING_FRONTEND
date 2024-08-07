import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from '../../css/livingRoom/recommendRecipe.module.css';
import Footer from '../../jsx/fix/Footer.jsx';

const RecommendRecipe = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const recipe = location.state?.recipe;

    if (!recipe) {
        return <div>레시피를 찾을 수 없습니다.</div>;
    }


    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <img className={styles.back} src="/lib/back.svg" alt="back" onClick={() => navigate('/refrigerator/search')} />
                <h2>추천 레시피</h2>
            </div>
            <div className={styles.recipeImg}>
                음식 이미지
            </div>
            <div className={styles.recipeTitle}>
                <p>음식 이름</p>
            </div>
            <div className={styles.recipeInfo}>
                <label>
                    <h3>재료</h3>
                    <p>재료</p>
                </label>
                <label>
                    <h3>양념</h3>
                    <p>양념</p>
                </label>
                <label>
                    <h3>조리 시간</h3>
                    <p>00분</p>
                </label>
                <label>
                    <h3>조리 방법</h3>
                    <p></p>
                </label>
            </div>
            <Footer/>
        </div>
    );
};

export default RecommendRecipe;
