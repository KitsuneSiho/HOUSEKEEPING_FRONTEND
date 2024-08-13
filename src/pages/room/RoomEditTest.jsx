import {useEffect, useState} from "react";
import EditRoomModel from "../../components/room/EditRoomModel.jsx";
import {useLogin} from "../../contexts/AuthContext.jsx";
import axiosInstance from "../../config/axiosInstance.js";

const RoomEditTest = () => {

    const {loginUserId} = useLogin();
    const [userLevel, setUserLevel] = useState("");
    const [rooms, setRooms] = useState([]);
    const [placementLists, setPlacementLists] = useState([]);
    const [furniture, setFurniture] = useState([]);
    const [isReady, setReady] = useState(false);

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

            setPlacementLists(response.data);
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

    return (
        <>
            {isReady &&
                <EditRoomModel room={rooms[0]} placementList={placementLists[0]} furniture={furniture} userLevel={userLevel}
                               savePlacement={savePlacement} deletePlacement={deletePlacement}/>}
        </>
    )
}

export default RoomEditTest