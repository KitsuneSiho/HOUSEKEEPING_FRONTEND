import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../css/livingRoom/searchRecipe.module.css';
import Footer from '../../jsx/fix/Footer.jsx';
import {searchRecipe} from "./recipeService.js";
import {useLogin} from "../../contexts/AuthContext.jsx";
import axiosConfig from "../../config/axiosConfig.js";

const SearchRecipe = () => {
    const navigate = useNavigate();
    const [mainIngredients, setMainIngredients] = useState([{ key: 0, value: '' }]);
    const [subIngredients, setSubIngredients] = useState([{ key: 0, value: '' }]);
    const [mainIngredientCounter, setMainIngredientCounter] = useState(1);
    const [subIngredientCounter, setSubIngredientCounter] = useState(1);
    const [ingredientsList, setIngredientsList] = useState([]);
    const [amount, setAmount] = useState('');
    const [dishType, setDishType] = useState('');
    const [cuisine, setCuisine] = useState('');
    const [cookingTime, setCookingTime] = useState('');
    const [recipes, setRecipes] = useState([]);
    const {loginUserId} = useLogin();

    useEffect(() => {
        fetchIngredients();
    }, []);

    const fetchIngredients = async () => {
        try {
            const response = await axiosConfig.get(`/food/ingredients`);
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

    const removeMainIngredient = (keyToRemove) => {
        setMainIngredients(mainIngredients.filter(ingredient => ingredient.key !== keyToRemove));
    };

    const removeSubIngredient = (keyToRemove) => {
        setSubIngredients(subIngredients.filter(ingredient => ingredient.key !== keyToRemove));
    };

    const handleSearch = async (e) => {
        e.preventDefault(); // 폼 제출 기본 동작 방지
        console.log('handleSearch 함수 실행');

        const ingredients = [...mainIngredients, ...subIngredients]
            .map(ing => ing.value)
            .filter(Boolean);

        const searchCriteria = {
            ingredients,
            amount,
            dishType,
            cuisine,
            cookingTime
        };

        console.log('검색 조건:', searchCriteria);

        try {
            console.log('레시피 검색 시작');
            const receivedRecipes = await searchRecipe(searchCriteria);
            console.log('API 응답 받음. 레시피 데이터:', receivedRecipes);
            setRecipes(receivedRecipes);
            navigate('/refrigerator/recommend', { state: { recipes: receivedRecipes } });
        } catch (error) {
            console.error('레시피 검색 중 오류 발생:', error);
            alert('레시피 검색에 실패했습니다. 다시 시도해 주세요.');
        }
    };

    const handleAmountChange = (e) => setAmount(e.target.value);
    const handleDishTypeChange = (e) => setDishType(e.target.value);
    const handleCuisineChange = (e) => setCuisine(e.target.value);
    const handleCookingTimeChange = (e) => setCookingTime(e.target.value);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <img className={styles.back} src="/lib/back.svg" alt="back" onClick={() => navigate('/refrigerator/')} />
                <h2>레시피 검색</h2>
            </div>

            <form className={styles.searchForm} onSubmit={handleSearch}>
                <div className={styles.section}>
                    <h3>조리 양</h3>
                    <div className={styles.options}>
                        <label><input type="radio" name="amount" value="1인분" onChange={handleAmountChange}/> 1인분</label>
                        <label><input type="radio" name="amount" value="2인분" onChange={handleAmountChange}/> 2인분</label>
                        <label><input type="radio" name="amount" value="3인분" onChange={handleAmountChange}/> 3인분</label>
                        <label><input type="radio" name="amount" value="4인분" onChange={handleAmountChange}/> 4인분</label>
                        <label><input type="radio" name="amount" value="5인분 이상" onChange={handleAmountChange}/> 5인분 이상</label>
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
                                {index !== 0 && (
                                    <button
                                        type="button"
                                        onClick={() => removeMainIngredient(ingredient.key)}
                                        className={styles.removeBtn}
                                    >
                                        X
                                    </button>
                                )}
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
                                {index !== 0 && (
                                    <button
                                        type="button"
                                        onClick={() => removeSubIngredient(ingredient.key)}
                                        className={styles.removeBtn}
                                    >
                                        X
                                    </button>
                                )}
                            </div>
                        ))}
                        <button type="button" onClick={addSubIngredient}>추가</button>
                    </div>
                </div>

                <div className={styles.section}>
                    <h3>요리 종류</h3>
                    <div className={styles.options}>
                        <label><input type="radio" name="dish-type" value="밥" onChange={handleDishTypeChange}/> 밥</label>
                        <label><input type="radio" name="dish-type" value="빵" onChange={handleDishTypeChange}/> 빵</label>
                        <label><input type="radio" name="dish-type" value="면" onChange={handleDishTypeChange}/> 면</label>
                        <label><input type="radio" name="dish-type" value="국" onChange={handleDishTypeChange}/> 국</label>
                        <label><input type="radio" name="dish-type" value="탕" onChange={handleDishTypeChange}/> 탕</label>
                        <label><input type="radio" name="dish-type" value="찌개" onChange={handleDishTypeChange}/> 찌개</label>
                        <label><input type="radio" name="dish-type" value="전골" onChange={handleDishTypeChange}/> 전골</label>
                        <label><input type="radio" name="dish-type" value="구이" onChange={handleDishTypeChange}/> 구이</label>
                        <label><input type="radio" name="dish-type" value="볶음" onChange={handleDishTypeChange}/> 볶음</label>
                        <label><input type="radio" name="dish-type" value="튀김" onChange={handleDishTypeChange}/> 튀김</label>
                        <label><input type="radio" name="dish-type" value="조림" onChange={handleDishTypeChange}/> 조림</label>
                        <label><input type="radio" name="dish-type" value="샐러드" onChange={handleDishTypeChange}/> 샐러드</label>
                        <label><input type="radio" name="dish-type" value="디저트" onChange={handleDishTypeChange}/> 디저트</label>
                    </div>
                </div>

                <div className={styles.section}>
                    <h3>요리 테마</h3>
                    <div className={styles.options}>
                        <label><input type="radio" name="cuisine" value="한식" onChange={handleCuisineChange}/> 한식</label>
                        <label><input type="radio" name="cuisine" value="중식" onChange={handleCuisineChange}/> 중식</label>
                        <label><input type="radio" name="cuisine" value="일식" onChange={handleCuisineChange}/> 일식</label>
                        <label><input type="radio" name="cuisine" value="양식" onChange={handleCuisineChange}/> 양식</label>
                        <label><input type="radio" name="cuisine" value="동남아" onChange={handleCuisineChange}/> 동남아</label>
                        <label><input type="radio" name="cuisine" value="인도" onChange={handleCuisineChange}/> 인도</label>
                        <label><input type="radio" name="cuisine" value="남미" onChange={handleCuisineChange}/> 남미</label>
                        <label><input type="radio" name="cuisine" value="퓨전" onChange={handleCuisineChange}/> 퓨전</label>
                    </div>
                </div>

                <div className={styles.section}>
                    <h3>조리 시간</h3>
                    <div className={styles.options}>
                        <label><input type="radio" name="cooking-time" value="10분 이하" onChange={handleCookingTimeChange}/> 10분 이하</label>
                        <label><input type="radio" name="cooking-time" value="10분 ~ 30분" onChange={handleCookingTimeChange}/> 10분 ~ 30분</label>
                        <label><input type="radio" name="cooking-time" value="30분 ~ 1시간" onChange={handleCookingTimeChange}/> 30분 ~ 1시간</label>
                        <label><input type="radio" name="cooking-time" value="1시간 이상" onChange={handleCookingTimeChange}/> 1시간 이상</label>
                    </div>
                </div>

                <div className={styles.formButtons}>
                    <button type="button" onClick={() => navigate('/refrigerator/')}>취소</button>
                    <button type="submit">레시피 검색</button>
                </div>
            </form>
            <Footer/>
        </div>
    );
};

export default SearchRecipe;