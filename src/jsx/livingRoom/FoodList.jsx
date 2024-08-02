import React, {useState, useEffect} from 'react';
import styles from '../../css/livingRoom/foodList.module.css';
import Footer from '../../jsx/fix/Footer.jsx';
import {useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';
import {BACK_URL} from "../../Constraints.js";

const FoodList = () => {
    // useState를 사용하여 컴포넌트의 상태 정의
    // [현재 값, 값을 변경하는 함수]
    const {category} = useParams();
    const [isEditMode, setIsEditMode] = useState(false); //편집 모드 여부
    const [currentRow, setCurrentRow] = useState(null); //현재 선택된 행
    const [foods, setFoods] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('ALL');
    const [modalData, setModalData] = useState({ //모달창에 뜰 데이터
        category: '',
        name: '',
        quantity: '',
        expiry: '',
        memo: '',
    });

    //페이지 이동 함수
    const navigate = useNavigate();

    // 임시 사용자 ID
    const userId = 1;

    // useEffect를 사용하여 컴포넌트가 마운트될 때 실행될 작업 정의
    useEffect(() => {
        fetchCategories();  // 카테고리 목록 불러오기
        fetchFoodsByCategory(category);
    }, []);  // 빈 배열을 넣어 컴포넌트가 처음 렌더링될 때만 실행되도록 함

    // 카테고리 목록을 가져오는 함수
    const fetchCategories = async () => {
        try {
            // axios를 사용하여 GET 요청
            const response = await axios.get(BACK_URL + `/food/livingroom?userId=${userId}`);
            // 'ALL' 카테고리를 추가하고 받아온 카테고리 목록 설정
            setCategories(['ALL', ...response.data]);
        } catch (error) {
            console.error('카테고리를 가져오는데 실패했습니다:', error);
            setCategories(['ALL']); // 에러 시 'ALL' 카테고리만 설정
        }
    };

    // 모든 식품 목록을 가져오는 함수
    const fetchFoods = async () => {

        try {
            const response = await axios.get(BACK_URL + `/food/foodlist/all?userId=${userId}`);
            console.log('Fetched foods data:', response.data);  // 추가된 로그
            setFoods(Array.isArray(response.data) ? response.data : []);  // 배열 체크 추가
        } catch (error) {
            console.error('식품 목록을 가져오는데 실패했습니다:', error);
            setFoods([]);
        }
    };

    // 특정 카테고리의 식품 목록을 가져오는 함수
    const fetchFoodsByCategory = async (category) => {

        if (category === 'all') {
            fetchFoods();  // 'ALL' 카테고리면 모든 식품을 가져온다
        } else {
            try {
                const response = await axios.get(BACK_URL + `/food/foodlist/${category}?userId=${userId}`);
                setFoods(response.data || []);  // 받아온 카테고리별 식품 목록을 설정 / 데이터 없을 시 빈 배열 반환
            } catch (error) {
                console.error('카테고리별 식품 목록을 가져오는데 실패했습니다:', error);
                setFoods([]); // 에러 시 빈 배열 반환
            }
        }
    };

    // // 식재료 수동 추가 함수
    // const addFood = async (foodName, foodQuantity) => {
    //     try {
    //         const response = await axios.post(BACK_URL + `/food/foodlist/${category}/add`, null, {
    //             params: {
    //                 userId: userId,
    //                 foodName: foodName,
    //                 foodQuantity: foodQuantity
    //             }
    //         });
    //         setFoods(response.data);
    //     } catch (error) {
    //         console.error('식재료 추가에 실패했습니다:', error);
    //         // 에러 처리 (예: 사용자에게 알림)
    //     }
    // };

    //편집 모드 토글 함수
    const toggleEditMode = () => {
        setIsEditMode(!isEditMode);
    };

    // // 행 추가 함수
    // const addRow = () => {
    //     setFoods([...foods, { foodCategory: category, foodName: '', foodQuantity: 1 }]);
    // };

    // 특정 행을 제거하는 함수
    const removeRow = (index) => {
        const newFoods = foods.filter((_, i) => i !== index);
        setFoods(newFoods);
    };

    // const removeLastRow = () => {
    //     setFoods(prevFoods => prevFoods.slice(0, -1));
    // };

    // 모달 창 여는 함수
    const openModal = (row, index) => {
        // row와 row.foodName이 존재하는지 확인
        if (row && row.foodName && row.foodName.trim()) {
            setCurrentRow(index);
            setModalData({
                category: row.foodCategory || '',
                name: row.foodName || '',
                quantity: row.foodQuantity || '',
                expiry: row.foodExpirationDate || '',
                memo: row.foodMemo || '',
            });
            document.getElementById('modal').style.display = 'block';
        }
    };

    //모달 창 닫는 함수
    const closeModal = () => {
        document.getElementById('modal').style.display = 'none';
    };

    // 모달에서 변경된 내용을 적용하는 함수
    const applyModalChanges = async () => {
        try {
            if (currentRow === null) {
                // 새로운 항목 추가

                const response = await axios.post(BACK_URL + `/food/foodlist/add`, {
                    userId: userId,
                    foodName: modalData.name,
                    foodQuantity: modalData.quantity,
                    foodCategory: modalData.category.toUpperCase(),
                    foodExpirationDate: modalData.expiry + 'T00:00:00' || null,
                    foodMemo: modalData.memo
                });

                // 서버 응답으로 받은 새 데이터로 상태 업데이트
                setFoods(prevFoods => [...prevFoods, response.data]);

                // 카테고리가 변경되었을 수 있으므로 전체 목록을 다시 불러옴
                await fetchFoodsByCategory(category);

            } else {

                // 기존 항목 수정
                const foodToUpdate = foods[currentRow];

                console.log(modalData, userId, foodToUpdate.foodId);
                const response = await axios.put(BACK_URL + `/food/foodlist/update`, {
                    userId: userId,
                    foodId: foodToUpdate.foodId,
                    foodName: modalData.name,
                    foodQuantity: modalData.quantity,
                    foodCategory: modalData.category,
                    foodExpirationDate: modalData.expiry + 'T00:00:00' || null,
                    foodMemo: modalData.memo
                });

                // 서버 응답으로 받은 업데이트된 데이터로 상태 업데이트
                const newFoods = foods.map((food, i) =>
                    i === currentRow ? response.data : food
                );
                setFoods(newFoods);
            }
            closeModal();

            // 변경 사항이 제대로 반영되었는지 확인하기 위해 전체 목록을 다시 불러옴
            await fetchFoodsByCategory(category);
        } catch (error) {
            console.error('식품 정보 업데이트 중 오류 발생:', error);
            // 에러 처리 (예: 사용자에게 알림)
            alert('식품 정보 업데이트에 실패했습니다. 다시 시도해 주세요.');
        }
    };

    // 추가 또는 적용 버튼 클릭 시 실행되는 함수
    const handleAddOrApply = () => {
        if (isEditMode) {
            toggleEditMode();
        } else {
            // 새로운 빈 식재료 데이터 생성
            const newFood = {
                foodCategory: category,
                foodName: '',
                foodQuantity: '',
                foodExpirationDate: '',
                foodMemo: ''
            };

            // 모달 데이터 설정
            setModalData({
                category: newFood.foodCategory || '',
                name: newFood.foodName || '',
                quantity: newFood.foodQuantity || '',
                expiry: newFood.foodExpirationDate || '',
                memo: newFood.foodMemo || '',
            });

            // 현재 행을 null로 설정 (새로운 항목 추가임을 나타냄)
            setCurrentRow(null);

            // 모달 창 열기
            document.getElementById('modal').style.display = 'block';
        }
    };


    // 식품 수량을 업데이트하는 함수
    const updateQuantity = (index, change) => {
        const newFoods = foods.map((food, i) =>
            i === index ? {...food, foodQuantity: Math.max(0, parseInt(food.foodQuantity) + change)} : food
        );
        setFoods(newFoods);
    };


    // 컴포넌트 UI 반환
    return (
        <div className={styles.container}>
            {/* 헤더 섹션 */}
            <div className={styles.header}>
                <img src="/lib/back.svg" alt="back" onClick={() => navigate('/livingRoom')}/>
                <h2>{category}</h2>
                <img src="/lib/검색.svg" alt="search" id={styles.searchIcon}
                     onClick={() => document.getElementById('search-bar').classList.toggle(styles.visible)}/>
            </div>

            {/* 검색 바 */}
            <div className={`${styles.searchBar}`} id="search-bar">
                <input type="text" placeholder="재료명 검색" id="search-input"/>
                <img src="/lib/검색.svg" alt="search"/>
            </div>


            {/* 식품 목록 테이블 */}
            <table className={styles.foodTable}>
                <thead>
                <tr>
                    <th>분류</th>
                    <th>이름</th>
                    <th>수량</th>
                </tr>
                </thead>
                {/* 수정된 부분: 빈 배열 처리 추가 */}
                <tbody>
                {Array.isArray(foods) && foods.length > 0 ? (
                    foods.map((food, index) => (
                        <tr key={`food-${food.foodId || index}`}>
                            <td>{food.foodCategory}</td>
                            <td onClick={() => openModal(food, index)}>
                                {isEditMode && index === foods.length - 1 ?
                                    <input
                                        type="text"
                                        value={food.foodName}
                                        onChange={(e) => {
                                            const newFoods = [...foods];
                                            newFoods[index].foodName = e.target.value;
                                            setFoods(newFoods);
                                        }}
                                    />
                                    : food.foodName
                                }
                            </td>
                            <td className={styles.quantityCell}>
                                {isEditMode ? (
                                    <>
                                        <button className={styles.quantityBtn}
                                                onClick={() => updateQuantity(index, -1)}>-
                                        </button>
                                        <span>{food.foodQuantity}</span>
                                        <button className={styles.quantityBtn}
                                                onClick={() => updateQuantity(index, 1)}>+
                                        </button>
                                    </>
                                ) : (
                                    <span>{food.foodQuantity}</span>
                                )}
                            </td>
                            <td>
                                {isEditMode &&
                                    <button className={styles.removeBtn} onClick={() => removeRow(index)}>✖</button>}
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="4">식품 목록이 없습니다.</td>
                    </tr>
                )}
                </tbody>
            </table>

            {/* 편집/추가 버튼 */}
            <div className={styles.editAddButton}>
                <button className={styles.editBtn} onClick={toggleEditMode}>{isEditMode ? '취소' : '수정'}</button>
                <button className={styles.addBtn} onClick={handleAddOrApply}>{isEditMode ? '적용' : '+'}</button>
            </div>

            {/* 모달 창 */}
            <div id="modal" className={styles.modal}>
                <div className={styles.modalContent}>
                    <h2>재료 세부 정보</h2>
                    <form id="modal-form">
                        <div className={styles.modalField}>
                            <label htmlFor="modal-category">분류</label>
                            <input type="text" id="modal-category" name="modal-category" value={modalData.category}
                                   onChange={(e) => setModalData({...modalData, category: e.target.value})}/>
                        </div>
                        <div className={styles.modalField}>
                            <label htmlFor="modal-name">이름</label>
                            <input type="text" id="modal-name" name="modal-name" value={modalData.name}
                                   onChange={(e) => setModalData({...modalData, name: e.target.value})}/>
                        </div>
                        <div className={styles.modalField}>
                            <label htmlFor="modal-quantity">수량</label>
                            <input type="number" id="modal-quantity" name="modal-quantity" value={modalData.quantity}
                                   onChange={(e) => setModalData({...modalData, quantity: e.target.value})}/>
                        </div>
                        <div className={styles.modalField}>
                            <label htmlFor="modal-expiry">유통기한</label>
                            <input type="date" id="modal-expiry" name="modal-expiry" value={modalData.expiry}
                                   onChange={(e) => setModalData({...modalData, expiry: e.target.value})}/>
                        </div>
                        <div className={styles.modalField}>
                            <label htmlFor="modal-memo">메모</label>
                            <input type="text" id="modal-memo" name="modal-memo" value={modalData.memo}
                                   onChange={(e) => setModalData({...modalData, memo: e.target.value})}/>
                        </div>
                        <div className={styles.modalButtons}>
                            <button type="button" onClick={closeModal}>취소</button>
                            <button type="button" onClick={applyModalChanges}>적용</button>
                        </div>
                    </form>
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default FoodList;