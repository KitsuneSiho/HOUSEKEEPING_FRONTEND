import {useEffect, useState} from "react";
import EditRoomModel from "../../components/room/EditRoomModel.jsx";
import styles from "../../css/main/mainLivingRoom.module.css";
import {useLogin} from "../../contexts/AuthContext.jsx";
import axiosInstance from "../../config/axiosInstance.js";

const EditRoom = () => {

    const {loginUserId} = useLogin();
    const [userLevel, setUserLevel] = useState("");
    const [rooms, setRooms] = useState([]);
    const [furniture, setFurniture] = useState([]);
    const [currentRoom, setCurrentRoom] = useState(0);
    const [isReady, setReady] = useState(false);
    const [myRoomList, setMyRoomList] = useState([]);
    const [kitchenList, setKitchenList] = useState([]);
    const [toiletList, setToiletList] = useState([]);
    const [myRoomDeleteList, setMyRoomDeleteList] = useState([]);
    const [kitchenDeleteList, setKitchenDeleteList] = useState([]);
    const [toiletDeleteList, setToiletDeleteList] = useState([]);

    useEffect(() => {

        if (loginUserId !== null) {
            getUserLevel();
            getRoomIds();
        }
    }, [loginUserId]);

    useEffect(() => {

        if (userLevel !== "") {
            getAvailableFurniture();
        }
    }, [userLevel]);

    useEffect(() => {

        if (JSON.stringify(rooms) !== JSON.stringify([])) {
            getPlacementLists().then(() => setReady(true));
        }
    }, [rooms])

    const getUserLevel = async () => {

        try {

            const response = await axiosInstance.get(`/user/level?userId=${loginUserId}`);
            setUserLevel(response.data);
        } catch (error) {
            console.error("Error getting user level");
        }
    }

    const getRoomIds = async () => {

        try {

            const response = await axiosInstance.get(`/room/list?userId=${loginUserId}`);

            setRooms(response.data)
        } catch (error) {
            console.error("Error fetching room:", error);
        }
    }

    const getPlacementLists = async () => {

        try {

            const response = await axiosInstance.get(`/placement/list/all?roomIds=${rooms[0].roomId}&roomIds=${rooms[1].roomId}&roomIds=${rooms[2].roomId}`);

            setMyRoomList(response.data[0]);
            setKitchenList(response.data[1]);
            setToiletList(response.data[2]);
        } catch (error) {
            console.error("Error fetching placementLists", error);
        }
    }

    const getAvailableFurniture = async () => {

        try {

            const response = await axiosInstance.get(`/furniture/list/${userLevel}`);

            setFurniture(response.data);
        } catch (error) {
            console.error("Error fetching available furnitures:", error);
        }
    }

    const savePlacement = async (placement, roomId) => {

        try {

            await axiosInstance.post(`/placement/register`, {
                ...placement,
                roomId: roomId,
                placementLocation: JSON.stringify(placement.placementLocation),
            })
        } catch (error) {
            console.error("error saving placemnet:", error)
        }
    }

    const deletePlacement = async (placementId) => {

        try {

            await axiosInstance.delete(`/placement/delete?placementId=${placementId}`)
        } catch (error) {
            console.error("error deleting placemnet:", error)
        }
    }

    const changeCurrentRoom = (adder) => {

        const newRoomNumber = currentRoom + adder;

        if (newRoomNumber >= 0) {
            setCurrentRoom(newRoomNumber % 3);
        } else {
            setCurrentRoom(newRoomNumber + 3);
        }
    }

    return (
        <>
            <div className={styles.roomDesign}>
                <img src="/lib/왼쪽화살표.svg" alt="왼쪽 화살표" onClick={() => changeCurrentRoom(-1)}/>
                <div className={styles.roomView}>
                    {isReady && <>
                        {currentRoom === 0 && <EditRoomModel room={rooms[0]} placementList={myRoomList} setPlacementList={setMyRoomList} furniture={furniture} userLevel={userLevel}
                               savePlacement={savePlacement} deletePlacement={deletePlacement} deletedPlacementList={myRoomDeleteList} setDeletedPlacementList={setMyRoomDeleteList}/>}
                        {currentRoom === 1 && <EditRoomModel room={rooms[1]} placementList={kitchenList} setPlacementList={setKitchenList} furniture={furniture} userLevel={userLevel}
                               savePlacement={savePlacement} deletePlacement={deletePlacement} deletedPlacementList={kitchenDeleteList} setDeletedPlacementList={setKitchenDeleteList}/>}
                        {currentRoom === 2 && <EditRoomModel room={rooms[2]} placementList={toiletList} setPlacementList={setToiletList} furniture={furniture} userLevel={userLevel}
                               savePlacement={savePlacement} deletePlacement={deletePlacement} deletedPlacementList={toiletDeleteList} setDeletedPlacementList={setToiletDeleteList}/>}
                    </>
                    }
                </div>
                <img src="/lib/오른쪽화살표.svg" alt="오른쪽 화살표" onClick={() => changeCurrentRoom(1)}/>
            </div>
        </>
    )
}

export default EditRoom