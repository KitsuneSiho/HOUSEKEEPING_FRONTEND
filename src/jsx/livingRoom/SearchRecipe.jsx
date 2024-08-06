import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../../css/livingRoom/searchRecipe.module.css';
import Footer from '../../jsx/fix/Footer.jsx';
import { BACK_URL } from "../../Constraints.js";

const SearchRecipe = () => {
    const navigate = useNavigate();
    const [mainIngredients, setMainIngredients] = useState([{ key: 0, value: '' }]);
    const [subIngredients, setSubIngredients] = useState([{ key: 0, value: '' }]);
    const [mainIngredientCounter, setMainIngredientCounter] = useState(1);
    const [subIngredientCounter, setSubIngredientCounter] = useState(1);
    const [ingredientsList, setIngredientsList] = useState([]);

    useEffect(() => {
        // 컴포넌트가 마운트될 때 식재료 리스트를 가져옵니다
        fetchIngredients();
    }, []);

    const fetchIngredients = async () => {
        try {
            const response = await axios.get(`${BACK_URL}/food/ingredients`);
            setIngredientsList(response.data);
        } catch (error) {
            console.error('식재료 리스트를 가져오는데 실패했습니다:', error);
        }
    };

    const addMainIngredient = () => {
        setMainIngredients([...mainIngredients, { key: mainIngredientCounter, value: '' }]);
        setMainIngredientCounter(mainIngredientCounter + 1);
    };

    const addSubIngredient = () => {
        setSubIngredients([...subIngredients, { key: subIngredientCounter, value: '' }]);
        setSubIngredientCounter(subIngredientCounter + 1);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <img className={styles.back} src="/lib/back.svg" alt="back" onClick={() => navigate('/refrigerator/')} />
                <h2>레시피 검색</h2>
            </div>

            <form className={styles.searchForm}>
                <div className={styles.section}>
                    <h3>조리 양</h3>
                    <div className={styles.options}>
                        <label><input type="radio" name="amount" value="1인분"/> 1인분</label>
                        <label><input type="radio" name="amount" value="2인분"/> 2인분</label>
                        <label><input type="radio" name="amount" value="3인분"/> 3인분</label>
                        <label><input type="radio" name="amount" value="4인분"/> 4인분</label>
                        <label><input type="radio" name="amount" value="5인분 이상"/> 5인분 이상</label>
                    </div>
                </div>

                <div className={styles.section}>
                    <h3>주 재료</h3>
                    <div className={styles.ingredientsContainer}>
                        {mainIngredients.map((ingredient, index) => (
                            <div key={ingredient.key} className={styles.ingredients}>
                                <select
                                    name="main-ingredient"
                                    value={ingredient.value}
                                    onChange={(e) => {
                                        const newIngredients = [...mainIngredients];
                                        newIngredients[index].value = e.target.value;
                                        setMainIngredients(newIngredients);
                                    }}
                                >
                                    <option value="">선택하세요</option>
                                    {ingredientsList.map((item, i) => (
                                        <option key={i} value={item}>{item}</option>
                                    ))}
                                </select>
                            </div>
                        ))}
                        <button type="button" onClick={addMainIngredient}>추가</button>
                    </div>
                </div>

                <div className={styles.section}>
                    <h3>부 재료</h3>
                    <div className={styles.ingredientsContainer}>
                        {subIngredients.map((ingredient, index) => (
                            <div key={ingredient.key} className={styles.ingredients}>
                                <select
                                    name="sub-ingredient"
                                    value={ingredient.value}
                                    onChange={(e) => {
                                        const newIngredients = [...subIngredients];
                                        newIngredients[index].value = e.target.value;
                                        setSubIngredients(newIngredients);
                                    }}
                                >
                                    <option value="">선택하세요</option>
                                    {ingredientsList.map((item, i) => (
                                        <option key={i} value={item}>{item}</option>
                                    ))}
                                </select>
                            </div>
                        ))}
                        <button type="button" onClick={addSubIngredient}>추가</button>
                    </div>
                </div>

                <div className={styles.section}>
                    <h3>요리 종류</h3>
                    <div className={styles.options}>
                        <label><input type="radio" name="dish-type" value="밥"/> 밥</label>
                        <label><input type="radio" name="dish-type" value="빵"/> 빵</label>
                        <label><input type="radio" name="dish-type" value="면"/> 면</label>
                        <label><input type="radio" name="dish-type" value="국"/> 국</label>
                        <label><input type="radio" name="dish-type" value="탕"/> 탕</label>
                        <label><input type="radio" name="dish-type" value="찌개"/> 찌개</label>
                        <label><input type="radio" name="dish-type" value="전골"/> 전골</label>
                        <label><input type="radio" name="dish-type" value="구이"/> 구이</label>
                        <label><input type="radio" name="dish-type" value="볶음"/> 볶음</label>
                        <label><input type="radio" name="dish-type" value="튀김"/> 튀김</label>
                        <label><input type="radio" name="dish-type" value="조림"/> 조림</label>
                        <label><input type="radio" name="dish-type" value="샐러드"/> 샐러드</label>
                        <label><input type="radio" name="dish-type" value="디저트"/> 디저트</label>
                    </div>
                </div>

                <div className={styles.section}>
                    <h3>음식 종류</h3>
                    <div className={styles.options}>
                        <label><input type="radio" name="cuisine" value="한식"/> 한식</label>
                        <label><input type="radio" name="cuisine" value="중식"/> 중식</label>
                        <label><input type="radio" name="cuisine" value="일식"/> 일식</label>
                        <label><input type="radio" name="cuisine" value="양식"/> 양식</label>
                        <label><input type="radio" name="cuisine" value="동남아"/> 동남아</label>
                        <label><input type="radio" name="cuisine" value="인도"/> 인도</label>
                        <label><input type="radio" name="cuisine" value="멕시코"/> 멕시코</label>
                        <label><input type="radio" name="cuisine" value="이탈리아"/> 이탈리아</label>
                        <label><input type="radio" name="cuisine" value="프랑스"/> 프랑스</label>
                        <label><input type="radio" name="cuisine" value="스페인"/> 스페인</label>
                        <label><input type="radio" name="cuisine" value="그리스"/> 그리스</label>
                        <label><input type="radio" name="cuisine" value="남미"/> 남미</label>
                        <label><input type="radio" name="cuisine" value="미국"/> 미국</label>
                        <label><input type="radio" name="cuisine" value="아프리카"/> 아프리카</label>
                        <label><input type="radio" name="cuisine" value="퓨전"/> 퓨전</label>
                    </div>
                </div>

                <div className={styles.section}>
                    <h3>조리 시간</h3>
                    <div className={styles.options}>
                        <label><input type="radio" name="cooking-time" value="10분 이하"/> 10분 이하</label>
                        <label><input type="radio" name="cooking-time" value="10분 ~ 30분"/> 10분 ~ 30분</label>
                        <label><input type="radio" name="cooking-time" value="30분 ~ 1시간"/> 30분 ~ 1시간</label>
                        <label><input type="radio" name="cooking-time" value="1시간 이상"/> 1시간 이상</label>
                    </div>
                </div>

                <div className={styles.formButtons}>
                    <button type="button" onClick={() => navigate('/refrigerator/')}>취소</button>
                    <button type="button" onClick={() => navigate('/refrigerator/recommend')}>레시피 검색</button>
                </div>
            </form>
            <Footer/>
        </div>
    );
};

export default SearchRecipe;
