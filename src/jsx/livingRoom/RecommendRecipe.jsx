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

    // 레시피 단계를 줄바꿈하여 표시하는 함수
    const formatSteps = (steps) => {
        if (!steps) return null;
        return steps.split('\n').map((step, index) => (
            <React.Fragment key={index}>
                {step}
                <br />
            </React.Fragment>
        ));
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <img className={styles.back} src="/lib/back.svg" alt="back" onClick={() => navigate('/refrigerator/search')} />
                <h2>추천 레시피</h2>
            </div>
            <div className={styles.recipeTitle}>
                <h3>{recipe.name || '이름 없음'}</h3>
            </div>
            <div className={styles.recipeInfo}>
                <p><strong>재료:</strong> {recipe.ingredients || '재료 정보 없음'}</p>
                <p><strong>소요 시간:</strong> {recipe.time || '시간 정보 없음'}</p>
                <h4 style={{ marginLeft: '2em' }}>레시피 단계:</h4>
                <div>{recipe.steps ? formatSteps(recipe.steps) : '레시피 단계 정보 없음'}</div>
            </div>
            <Footer/>
        </div>
    );
};

export default RecommendRecipe;