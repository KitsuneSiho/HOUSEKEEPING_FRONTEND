import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../css/livingRoom/uploadFoodListCheck.module.css';
import Footer from '../../jsx/fix/Footer.jsx';

const UploadFoodListCheck = () => {
    const navigate = useNavigate();
    const [foodList, setFoodList] = useState([]);

    const addRow = () => {
        setFoodList([...foodList, { category: '', name: '', quantity: '' }]);
    };

    const removeRow = (index) => {
        setFoodList(foodList.filter((_, i) => i !== index));
    };

    const handleInputChange = (index, field, value) => {
        const newFoodList = [...foodList];
        newFoodList[index][field] = value;
        setFoodList(newFoodList);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <img
                    src="/lib/back.svg"
                    alt="back"
                    onClick={() => navigate('/uploadFood')}
                />
                <h2>재료 등록</h2>
                <h3 onClick={() => navigate('/livingRoom')}>등록</h3>
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
                {foodList.map((item, index) => (
                    <tr key={index}>
                        <td>
                            <input
                                type="text"
                                className={styles.category}
                                value={item.category}
                                onChange={(e) =>
                                    handleInputChange(index, 'category', e.target.value)
                                }
                            />
                        </td>
                        <td>
                            <input
                                type="text"
                                className={styles.name}
                                value={item.name}
                                onChange={(e) =>
                                    handleInputChange(index, 'name', e.target.value)
                                }
                            />
                        </td>
                        <td>
                            <input
                                type="text"
                                className={styles.quantity}
                                value={item.quantity}
                                onChange={(e) =>
                                    handleInputChange(index, 'quantity', e.target.value)
                                }
                            />
                        </td>
                        <td className={styles.xBtn}>
                            <button onClick={() => removeRow(index)}>✖</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <button className={styles.addBtn} onClick={addRow}>
                <img src="/lib/plus.svg" alt="plus" />
            </button>
            <Footer/>
        </div>
    );
};

export default UploadFoodListCheck;
