import styles from "../../css/first/firstRoomDesign.module.css";
import PropTypes from "prop-types";
import React, {useEffect, useState} from "react";
import axiosInstance from "../../config/axiosInstance.js";

const FurnitureList = ({furniture, activeCategory, userLevel, handleCategoryClick, openColorModal, loadFurniture, availableFurnitureTypes}) => {

    const [furnitureTypes, setFurnitureTypes] = useState([]);
    const furnitureTypeNames = {
        DESK: "책상",
        BED: "침대",
        SOFA: "소파",
        CLOSET: "옷장",
        CHAIR: "의자",
        POCKETMON: "포켓몬",
        ETC: "기타",
    }

    useEffect(() => {
        getFurnitureTypes();
    }, []);

    const getFurnitureTypes = async () => {

        try {

            const response = await axiosInstance.get(`/furniture/type/list/${userLevel}`)
            setFurnitureTypes(response.data);

        } catch (error) {
            console.error("error getting furniture types", error);
        }
    }

    return (
        <>
            <div className={styles.furnitureCategories}>
                {availableFurnitureTypes.slice(0, 7).map((furnitureType, index) => (
                    <p key={index}
                       onClick={() => handleCategoryClick(furnitureType.furnitureType)}>{furnitureType.typeName}</p>
                ))}
            </div>
            <div className={styles.furnitureCategories}>
                {availableFurnitureTypes.slice(7).map((furnitureType, index) => (
                    <p key={index}
                       onClick={() => handleCategoryClick(furnitureType.furnitureType)}>{furnitureType.typeName}</p>
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
                                    }, true)}>
                                        <img
                                            src={`/furniture/${furniture.furnitureType}/${furniture.furnitureName}.png`}
                                            alt={furniture.furnitureName}/>

                                    </button>
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
    availableFurnitureTypes: PropTypes.array,
}

export default FurnitureList