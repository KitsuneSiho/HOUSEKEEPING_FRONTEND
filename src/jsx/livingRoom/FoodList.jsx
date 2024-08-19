import React, {useState, useEffect} from 'react';
import styles from '../../css/livingRoom/foodList.module.css';
import Footer from '../../jsx/fix/Footer.jsx';
import {useNavigate, useParams} from 'react-router-dom';
import {useLogin} from "../../contexts/AuthContext.jsx";
import axiosConfig from "../../config/axiosConfig.js";

const FoodCategory = {
    MILK: '유제품',
    MEAT: '육류',
    SEAFOOD: '해산물',
    VEGETABLE: '채소',
    FRUIT: '과일',
    NUTS: '견과류',
    SEASONING: '조미료',
    OIL: '기름',
    FLOUR: '밀가루',
    BEVERAGE: '음료',
    ETC: '기타'
};

// 날짜 검증 함수 추가
const isValidDate = (date) => {
    if (!date) return true; // 날짜가 없으면 유효하다고 간주
    const inputDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 시간을 00:00:00으로 설정
    return inputDate >= today;
};

const FoodList = () => {
    // useState를 사용하여 컴포넌트의 상태 정의
    // [현재 값, 값을 변경하는 함수]
    const {category} = useParams();
    const [isEditMode, setIsEditMode] = useState(false); //편집 모드 여부
    const [currentRow, setCurrentRow] = useState(null); //현재 선택된 행
    const [foods, setFoods] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('ALL');
    const [deletedFoods, setDeletedFoods] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredFoods, setFilteredFoods] = useState([]);
    const [modalData, setModalData] = useState({ //모달창에 뜰 데이터
        category: '',
        name: '',
        quantity: '',
        expiry: '',
        memo: '',
    });
    const {user} = useLogin();

    //페이지 이동 함수
    const navigate = useNavigate();



    // useEffect를 사용하여 컴포넌트가 마운트될 때 실행될 작업 정의
    useEffect(() => {
        fetchCategories();  // 카테고리 목록 불러오기
        fetchFoodsByCategory(category);
    }, [category]);  // 빈 배열을 넣어 컴포넌트가 처음 렌더링될 때만 실행되도록 함

    useEffect(() => {
        setFilteredFoods(foods);
    }, [foods]);

    // 카테고리가 'all'인지 확인하는 함수 -> 전체보기에서 '+'버튼 지울 때 사용
    const isAllCategory = () => category.toLowerCase() === 'all';

    // 카테고리 목록을 가져오는 함수
    const fetchCategories = async () => {
        try {
            // axios를 사용하여 GET 요청
            const response = await axiosConfig.get(`/food/livingroom?userId=${user.userId}`);
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
            const response = await axiosConfig.get(`/food/foodlist/all?userId=${user.userId}`);
            console.log('Fetched foods data:', response.data);  // 추가된 로그
            setFoods(Array.isArray(response.data) ? response.data : []);  // 배열 체크 추가
        } catch (error) {
            console.error('식품 목록을 가져오는데 실패했습니다:', error);
            setFoods([]);
        }
    };

    // 특정 카테고리의 식품 목록을 가져오는 함수
    const fetchFoodsByCategory = async (category) => {
        try {
            let response;
            if (category.toLowerCase() === 'all') {
                response = await axiosConfig.get(`/food/foodlist/all?userId=${user.userId}`);
            } else {
                response = await axiosConfig.get(`/food/foodlist/${category}?userId=${user.userId}`);
            }
            setFoods(response.data || []);
        } catch (error) {
            console.error('식품 목록을 가져오는데 실패했습니다:', error);
            setFoods([]);
        }
    };

    //편집 모드 토글 함수
    const toggleEditMode = () => {
        if (isEditMode) {
            // 편집 모드 종료 시 임시 삭제 상태 초기화
            setFoods([...foods, ...deletedFoods]);
            setDeletedFoods([]);
        }
        setIsEditMode(!isEditMode);
    };

    // 모달 창 여는 함수
    const openModal = (row, index) => {
        // row와 row.foodName이 존재하는지 확인
        if (row && row.foodName && row.foodName.trim()) {
            setCurrentRow(index);
            setModalData({
                category: row.foodCategory || category.toUpperCase(),
                name: row.foodName || '',
                quantity: row.foodQuantity || '',
                expiry: row.foodExpirationDate ? row.foodExpirationDate.split('T')[0] : '',
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

        if (!isValidDate(modalData.expiry)) {
            alert('날짜를 다시 설정해주세요. 유통기한은 오늘 이후의 날짜여야 합니다.');
            return;
        }

        try {
            const foodData = {
                userId: user.userId,
                foodName: modalData.name,
                foodQuantity: modalData.quantity,
                foodCategory: modalData.category.toUpperCase(),
                foodExpirationDate: modalData.expiry ? modalData.expiry + 'T00:00:00' : null, // 여기를 수정
                foodMemo: modalData.memo
            };

            if (currentRow === null) {
                // 새로운 항목 추가
                const response = await axiosConfig.post(`/food/foodlist/add`, foodData);
                setFoods(prevFoods => [...prevFoods, response.data]);
            } else {
                // 기존 항목 수정
                const foodToUpdate = foods[currentRow];
                foodData.foodId = foodToUpdate.foodId;
                const response = await axiosConfig.put(`/food/foodlist/update`, foodData);
                const newFoods = foods.map((food, i) =>
                    i === currentRow ? response.data : food
                );
                setFoods(newFoods);
            }
            closeModal();

            // 변경 사항이 제대로 반영되었는지 확인하기 위해 전체 목록을 다시 불러옴
            await fetchFoodsByCategory(category);
        } catch (error) {
            console.error('식재료 수정/추가 중 오류 발생:', error);
            alert('식재료 수정/추가에 실패했습니다. 다시 시도해 주세요.');

            // 실패 시 deletedFoods 를 foods 에 다시 추가
            setFoods([...foods, ...deletedFoods]);
            setDeletedFoods([]);
        }
    };

    // 추가 또는 적용 버튼 클릭 시 실행되는 함수
    const handleAddOrApply = async () => {
        if (isEditMode) {
            try {
                // 수정된 모든 식재료 정보를 DB에 업데이트
                for (const food of foods) {
                    await axiosConfig.put(`/food/foodlist/update`, {
                        userId: user.userId,
                        foodId: food.foodId,
                        foodName: food.foodName,
                        foodQuantity: food.foodQuantity,
                        foodCategory: food.foodCategory,
                        foodExpirationDate: food.foodExpirationDate,
                        foodMemo: food.foodMemo
                    });
                }

                // 삭제된 항목 처리
                await performDelete();

                // 변경 사항이 제대로 반영되었는지 확인하기 위해 전체 목록을 다시 불러옴
                await fetchFoodsByCategory(category);

                setIsEditMode(false);
            } catch (error) {
                console.error('식재료 수정 중 오류 발생:', error);
                alert('식재료 수정에 실패했습니다. 다시 시도해 주세요.');
            }
        } else {
            // 새로운 항목 추가 로직
            setModalData({
                category: category.toUpperCase(),
                name: '',
                quantity: '',
                expiry: '',
                memo: '',
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

    // 식재료 임시 삭제 함수
    const tempDeleteFood = (index) => {
        const foodToDelete = foods[index];
        setDeletedFoods([...deletedFoods, foodToDelete]);
        const newFoods = foods.filter((_, i) => i !== index);
        setFoods(newFoods);
    };

    // 실제 삭제 수행 함수
    const performDelete = async () => {
        try {
            for (const food of deletedFoods) {
                await axiosConfig.delete(`/food/foodlist/delete/${food.foodId}`, {
                    params: { userId: user.userId }
                });
            }
            setDeletedFoods([]);
        } catch (error) {
            console.error('식재료 삭제 중 오류 발생:', error);
            alert('일부 식재료 삭제에 실패했습니다. 다시 시도해 주세요.');
        }
    };

    //검색 수행 함수
    const handleSearch = (term) => {
        setSearchTerm(term);
        if (term.trim() === '') {
            setFilteredFoods(foods);
        } else {
            const filtered = foods.filter(food =>
                food.foodName.toLowerCase().includes(term.toLowerCase())
            );
            setFilteredFoods(filtered);
        }
    };


    // 컴포넌트 UI 반환
    return (
        <div className={styles.container}>
            {/* 헤더 섹션 */}
            <div className={styles.header}>
                <img className={styles.back} src="/lib/back.svg" alt="back" onClick={() => navigate('/refrigerator/')}/>
                <h2>{category}</h2>
                <img src="/lib/검색.svg" alt="search" className={styles.searchIcon}
                     onClick={() => document.getElementById('search-bar').classList.toggle(styles.visible)}/>
            </div>

            {/* 검색 바 */}
            <div className={`${styles.searchBar}`} id="search-bar">
                <input
                    type="text"
                    placeholder="재료명 검색"
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                />
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

                <tbody>
                {filteredFoods.length > 0 ? (
                    filteredFoods.map((food, index) => (
                        <tr key={`food-${food.foodId || index}`}>
                            <td>{food.foodCategory}</td>
                            <td onClick={() => openModal(food, index)}>
                                {food.foodName}
                            </td>
                            <td className={styles.quantityCell}>
                                {isEditMode ? (
                                    <>
                                        <button
                                            className={styles.quantityBtn}
                                            onClick={() => updateQuantity(index, -1)}
                                            disabled={food.foodQuantity <= 1}
                                        >
                                            -
                                        </button>
                                        <span>{food.foodQuantity}</span>
                                        <button
                                            className={styles.quantityBtn}
                                            onClick={() => updateQuantity(index, 1)}
                                        >
                                            +
                                        </button>
                                    </>
                                ) : (
                                    <span>{food.foodQuantity}</span>
                                )}
                            </td>
                            <td>
                                {isEditMode &&
                                    <button className={styles.removeBtn}
                                            onClick={() => tempDeleteFood(index)}>✖</button>}
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="4">검색 결과가 없습니다.</td>
                    </tr>
                )}
                </tbody>
            </table>

            {/* 편집/추가 버튼 */}
            <div className={styles.editAddButton}>
                <button className={styles.editBtn} onClick={toggleEditMode}>
                    {isEditMode ? '취소' : '수정'}
                </button>
                {(isEditMode || !isAllCategory()) && (
                    <button className={styles.addBtn} onClick={handleAddOrApply}>
                        {isEditMode ? '적용' : '+'}
                    </button>
                )}
            </div>

            {/* 모달 창 */}
            <div id="modal" className={styles.modal}>
                <div className={styles.modalContent}>
                    <h2>재료 세부 정보</h2>
                    <form id="modal-form">
                        <div className={styles.modalField}>
                            <label htmlFor="modal-category">분류</label>
                            <select
                                id="modal-category"
                                value={modalData.category}
                                onChange={(e) => setModalData({...modalData, category: e.target.value})}
                            >
                                {Object.entries(FoodCategory).map(([key, value]) => (
                                    <option key={key} value={key}>{value}</option>
                                ))}
                            </select>
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
                            <input
                                type="date"
                                id="modal-expiry"
                                name="modal-expiry"
                                value={modalData.expiry || ''}
                                onChange={(e) => setModalData({...modalData, expiry: e.target.value || null})}
                            />
                        </div>
                        <div className={styles.modalField}>
                            <label htmlFor="modal-memo">메모</label>
                            <textarea rows={3} cols={30} id="modal-memo" name="modal-memo" value={modalData.memo}
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
