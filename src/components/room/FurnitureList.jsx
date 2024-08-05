import styles from "../../css/first/firstRoomDesign.module.css";
import PropTypes from "prop-types";
import {useEffect, useState} from "react";
import axios from "axios";
import {BACK_URL} from "../../Constraints.js";

const FurnitureList = ({furniture, activeCategory, userLevel, handleCategoryClick, openColorModal, loadFurniture}) => {

    const [furnitureTypes, setFurnitureTypes] = useState([]);

    useEffect(() => {
        getFurnitureTypes();
    }, []);

    const getFurnitureTypes = async () => {

        try {

            const response = await axios.get(BACK_URL + `/furniture/type/list/${userLevel}`)
            setFurnitureTypes(response.data);
            console.log(response.data);

        } catch (error) {
            console.error("error getting furniture types", error);
        }
    }

    return (
        <>
            <div className={styles.furnitureCategories}>
                <p onClick={() => handleCategoryClick('WALLFLOOR')}>벽&바닥</p>
                {furnitureTypes.map((furnitureType, index) => (
                    <p key={index}
                       onClick={() => handleCategoryClick(furnitureType.furnitureType)}>{furnitureType.furnitureType}</p>
                ))}
            </div>
            {activeCategory && (
                <div className={styles.furnitureAddButton}>
                    {activeCategory === 'WALLFLOOR' && (
                        <>
                            <button onClick={() => openColorModal('leftWall')}>왼쪽 벽</button>
                            <button onClick={() => openColorModal('backWall')}>오른쪽 벽</button>
                            <button onClick={() => openColorModal('floor')}>바닥</button>
                        </>
                    )}

                    {furnitureTypes.map((furnitureType, index) => (
                        <div key={index}>
                            {activeCategory === furnitureType.furnitureType
                                &&
                                furniture.filter(furniture => (furniture.furnitureType === furnitureType.furnitureType)).map((furniture, index) => (
                                    <button key={index} onClick={() => loadFurniture({
                                        furnitureId: furniture.furnitureId,
                                        furnitureType: furniture.furnitureType,
                                        furnitureName: furniture.furnitureName,
                                        placementLocation: JSON.stringify({x: 0, y: 0, z: 0}),
                                        placementAngle: 0,
                                        placementSize: 1
                                    }, true)}>{furniture.furnitureName}</button>
                                ))}
                        </div>
                    ))}
                </div>
            )}
        </>
    )
}

FurnitureList.propTypes = {
    furniture: PropTypes.array,
    activeCategory: PropTypes.string,
    userLevel: PropTypes.string,
    handleCategoryClick: PropTypes.func,
    openColorModal: PropTypes.func,
    loadFurniture: PropTypes.func,
}

export default FurnitureList