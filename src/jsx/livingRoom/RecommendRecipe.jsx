import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from '../../css/livingRoom/recommendRecipe.module.css';
import Footer from '../../jsx/fix/Footer.jsx';

const RecommendRecipe = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const recipes = location.state?.recipes;

    console.log('Received recipes:', recipes);

    if (!recipes || recipes.length === 0) {
        return <div>레시피를 찾을 수 없습니다.</div>;
    }

    const recipe = recipes[0]; // 첫 번째 레시피 사용

    console.log('Full recipe object:', recipe);

    // 레시피 단계를 리스트 형식으로 표시하는 함수
    const formatSteps = (steps) => {
        if (!steps) return null;
        return (
            <ul>
                {steps.split('\n').map((step, index) => (
                    <li key={index}>{step}</li>
                ))}
            </ul>
        );
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <img className={styles.back} src="/lib/back.svg" alt="back" onClick={() => navigate('/refrigerator/search')} />
                <h2>추천 레시피</h2>
            </div>
            <div className={styles.recipeTitle}>
                <h2>{recipe.name || '이름 없음'}</h2>
            </div>
            <div className={styles.recipeInfo}>
                <div className={styles.recipeTime}>
                    <h3>소요시간</h3>
                    <p>{recipe.time || '시간 정보 없음'}</p>
                </div>
                <div className={styles.recipeMaterial}>
                    <h3>재료</h3>
                    <p>{recipe.ingredients || '재료 정보 없음'}</p>
                </div>

                <div className={styles.recipe}>
                    <h3>조리법</h3>
                    <div>{recipe.steps ? formatSteps(recipe.steps) : '레시피 단계 정보 없음'}</div>
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default RecommendRecipe;
