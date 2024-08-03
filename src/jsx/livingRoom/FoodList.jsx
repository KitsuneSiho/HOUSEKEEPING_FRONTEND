import React, { useState } from 'react';
import styles from '../../css/livingRoom/foodList.module.css';
import Footer from '../../jsx/fix/Footer.jsx';
import { useNavigate } from 'react-router-dom';

const FoodList = () => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentRow, setCurrentRow] = useState(null);
    const [rows, setRows] = useState([]);
    const [modalData, setModalData] = useState({
        category: '',
        name: '',
        quantity: '',
        expiry: '',
        memo: '',
    });

    const navigate = useNavigate();

    const toggleEditMode = () => {
        setIsEditMode(!isEditMode);
    };

    const addRow = () => {
        setRows([...rows, { category: '', name: '', quantity: '0' }]);
    };

    const removeRow = (index) => {
        const newRows = rows.filter((_, i) => i !== index);
        setRows(newRows);
    };

    const openModal = (row, index) => {
        if (!row.name.trim()) return;
        setCurrentRow(index);
        setModalData({
            category: row.category,
            name: row.name,
            quantity: row.quantity,
            expiry: '',
            memo: '',
        });
        document.getElementById('modal').style.display = 'block';
    };

    const closeModal = () => {
        document.getElementById('modal').style.display = 'none';
    };

    const applyModalChanges = () => {
        const newRows = rows.map((row, i) =>
            i === currentRow ? { ...row, ...modalData } : row
        );
        setRows(newRows);
        closeModal();
    };

    const updateQuantity = (index, change) => {
        const newRows = rows.map((row, i) =>
            i === index ? { ...row, quantity: Math.max(0, parseInt(row.quantity) + change) } : row
        );
        setRows(newRows);
    };

    const handleAddOrApply = () => {
        if (isEditMode) {
            toggleEditMode();
        } else {
            addRow();
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <img className={styles.back} src="/lib/back.svg" alt="back" onClick={() => navigate('/refrigerator')} />
                <h2>ALL</h2>
                <img src="/lib/검색.svg" alt="search" className={styles.searchIcon} onClick={() => document.getElementById('search-bar').classList.toggle(styles.visible)} />
            </div>

            <div className={`${styles.searchBar}`} id="search-bar">
                <input type="text" placeholder="재료명 검색" id="search-input" />
                <img src="/lib/검색.svg" alt="search" />
            </div>

            <table className={styles.foodTable}>
                <thead>
                <tr>
                    <th>분류</th>
                    <th>이름</th>
                    <th>수량</th>
                </tr>
                </thead>
                <tbody>
                {rows.map((row, index) => (
                    <tr key={index}>
                        <td><input type="text" value={row.category} onChange={(e) => {
                            const newRows = [...rows];
                            newRows[index].category = e.target.value;
                            setRows(newRows);
                        }} /></td>
                        <td><input type="text" value={row.name} onChange={(e) => {
                            const newRows = [...rows];
                            newRows[index].name = e.target.value;
                            setRows(newRows);
                        }} onClick={() => openModal(row, index)} /></td>
                        <td className={styles.quantityCell}>
                            {isEditMode ? (
                                <>
                                    <button className={styles.quantityBtn} onClick={() => updateQuantity(index, -1)}>-</button>
                                    <span>{row.quantity}</span>
                                    <button className={styles.quantityBtn} onClick={() => updateQuantity(index, 1)}>+</button>
                                </>
                            ) : (
                                <span>{row.quantity}</span>
                            )}
                        </td>
                        <td>
                            {isEditMode && <button className={styles.removeBtn} onClick={() => removeRow(index)}>✖</button>}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <div className={styles.editAddButton}>
                <button className={styles.editBtn} onClick={toggleEditMode}>{isEditMode ? '취소' : '수정'}</button>
                <button className={styles.addBtn} onClick={handleAddOrApply}>{isEditMode ? '적용' : '+'}</button>
            </div>

            {/* Modal */}
            <div id="modal" className={styles.modal}>
                <div className={styles.modalContent}>
                    <h2>재료 세부 정보</h2>
                    <form id="modal-form">
                        <div className={styles.modalField}>
                            <label htmlFor="modal-category">분류</label>
                            <input type="text" id="modal-category" name="modal-category" value={modalData.category} onChange={(e) => setModalData({ ...modalData, category: e.target.value })} />
                        </div>
                        <div className={styles.modalField}>
                            <label htmlFor="modal-name">이름</label>
                            <input type="text" id="modal-name" name="modal-name" value={modalData.name} onChange={(e) => setModalData({ ...modalData, name: e.target.value })} />
                        </div>
                        <div className={styles.modalField}>
                            <label htmlFor="modal-quantity">수량</label>
                            <input type="number" id="modal-quantity" name="modal-quantity" value={modalData.quantity} onChange={(e) => setModalData({ ...modalData, quantity: e.target.value })} />
                        </div>
                        <div className={styles.modalField}>
                            <label htmlFor="modal-expiry">유통기한</label>
                            <input type="date" id="modal-expiry" name="modal-expiry" value={modalData.expiry} onChange={(e) => setModalData({ ...modalData, expiry: e.target.value })} />
                        </div>
                        <div className={styles.modalField}>
                            <label htmlFor="modal-memo">메모</label>
                            <input type="text" id="modal-memo" name="modal-memo" value={modalData.memo} onChange={(e) => setModalData({ ...modalData, memo: e.target.value })} />
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
