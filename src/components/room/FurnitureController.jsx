import styles from "../../css/first/firstRoomDesign.module.css";
import * as propTypes from "prop-types";

const FurnitureController = ({
                                 showModal,
                                 modalType,
                                 position,
                                 rotation,
                                 scale,
                                 updatePosition,
                                 updateRotation,
                                 updateScale,
                                 handleColorChange,
                                 handleDelete,
                                 closeModal,
                                 cancelColorChange,
                                 selectedFurniture
                             }) => {

    return (
        <>
            {showModal && (
                <div className={styles.modal}>
                    {modalType === 'furniture' ? (
                        <>
                            <div className={styles.sliderControls}>
                                <p>{selectedFurniture.placement.furnitureName}</p>
                                <label className={styles.xControls}>
                                    <p>X축위치:</p>
                                    <input
                                        type="range"
                                        min="-10"
                                        max="10"
                                        value={position.x}
                                        onChange={(e) => updatePosition('x', e.target.value)}
                                    />
                                    <input
                                        type="number"
                                        value={position.x}
                                        onChange={(e) => updatePosition('x', e.target.value)}
                                    />
                                </label>
                                <label className={styles.zControls}>
                                    <p>Y축위치:</p>
                                    <input
                                        type="range"
                                        min="-10"
                                        max="10"
                                        value={position.z}
                                        onChange={(e) => updatePosition('z', e.target.value)}
                                    />
                                    <input
                                        type="number"
                                        value={position.z}
                                        onChange={(e) => updatePosition('z', e.target.value)}
                                    />
                                </label>
                                <label className={styles.yControls}>
                                    <p>Z축위치:</p>
                                    <input
                                        type="range"
                                        min="-10"
                                        max="10"
                                        value={position.y}
                                        onChange={(e) => updatePosition('y', e.target.value)}
                                    />
                                    <input
                                        type="number"
                                        value={position.y}
                                        onChange={(e) => updatePosition('y', e.target.value)}
                                    />
                                </label>
                                <label className={styles.rotation}>
                                    <p>회전:</p>
                                    <input
                                        type="range"
                                        min="0"
                                        max={Math.PI * 2}
                                        step={0.01}
                                        value={rotation}
                                        onChange={(e) => updateRotation(e.target.value)}
                                    />
                                    <input
                                        type="number"
                                        value={rotation}
                                        onChange={(e) => updateRotation(e.target.value)}
                                    />
                                </label>
                                <label className={styles.scale}>
                                    <p>크기:</p>
                                    <input
                                        type="range"
                                        min="0.1"
                                        max="15"
                                        step="0.1"
                                        value={scale}
                                        onChange={(e) => updateScale(e.target.value)}
                                    />
                                    <input
                                        type="number"
                                        value={scale}
                                        onChange={(e) => updateScale(e.target.value)}
                                    />
                                </label>
                            </div>
                            <div className={styles.furnitureSubmit}>
                                <button onClick={handleDelete}>삭제</button>
                                <button onClick={closeModal}>확인</button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className={styles.colorControls}>
                                <p>색상 선택:</p>
                                <input type="color" onChange={handleColorChange}/>
                            </div>
                            <div className={styles.furnitureSubmit}>
                                <button onClick={cancelColorChange}>취소</button>
                                <button onClick={closeModal}>적용</button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </>
    )
}

FurnitureController.propTypes = {
    showModal: propTypes.bool,
    modalType: propTypes.string,
    position: propTypes.object,
    rotation: propTypes.number,
    scale: propTypes.number,
    updatePosition: propTypes.func,
    updateRotation: propTypes.func,
    updateScale: propTypes.func,
    handleColorChange: propTypes.func,
    handleDelete: propTypes.func,
    closeModal: propTypes.func,
    cancelColorChange: propTypes.func,
}

export default FurnitureController