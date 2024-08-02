import {useModal} from "../context/ModalContext.jsx";

const ModalExample = () => {

    const {setModalType, setModalTitle, setModalBody, showModal, hideModal} = useModal();

    return (
        <div>
            <div>
                모달 종류:
                <select onChange={(e) => {
                    setModalType(e.target.value)
                }}>
                    <option value={""}>-</option>
                    <option value={"inform"}>inform</option>
                </select>
            </div>
            <div>
                모달 제목:
                <input onChange={(e) => {
                    setModalTitle(e.target.value)
                }}/>
            </div>
            <div>
                모달 내용:
                <input onChange={(e) => {
                    setModalBody(e.target.value)
                }}/>
            </div>
            <div>
                <button onClick={showModal}>모달 출력</button>
            </div>
        </div>
    )
}

export default ModalExample