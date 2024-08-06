import {useEffect, useState} from "react";
import axios from "axios";
import {BACK_URL} from "../../Constraints.js";
import EditRoomModel from "../../components/room/EditRoomModel.jsx";

const RoomEditTest = () => {

    const [userId, setUserId] = useState("");
    const [userLevel, setUserLevel] = useState("");
    const [rooms, setRooms] = useState([]);
    const [placementLists, setPlacementLists] = useState([]);
    const [furniture, setFurniture] = useState([]);
    const [isReady, setReady] = useState(false);

    useEffect(() => {
        setUserId(sessionStorage.getItem("userId"));
        setUserLevel(sessionStorage.getItem("userLevel"));
    }, []);

    useEffect(() => {

        if (userLevel !== "") {
            getAvailableFurniture();
        }
    }, [userLevel]);

    useEffect(() => {

        if (userId !== "") {

            getRoomIds();
        }
    }, [userId])

    useEffect(() => {

        if (JSON.stringify(rooms) !== JSON.stringify([])) {
            getPlacementLists().then(() => setReady(true));
        }
    }, [rooms])

    const getRoomIds = async () => {

        try {

            const response = await axios.get(BACK_URL + `/room/list?userId=${userId}`);

            setRooms(response.data)
        } catch (error) {
            console.error("Error fetching room:", error);
        }
    }

    const getPlacementLists = async () => {

        try {

            const response = await axios.get(BACK_URL + `/placement/list/all?roomIds=${rooms[0].roomId}&roomIds=${rooms[1].roomId}&roomIds=${rooms[2].roomId}`);

            setPlacementLists(response.data);
        } catch (error) {
            console.error("Error fetching placementLists", error);
        }
    }

    const getAvailableFurniture = async () => {

        try {

            const response = await axios.get(BACK_URL + `/furniture/list/${userLevel}`);

            setFurniture(response.data);
        } catch (error) {
            console.error("Error fetching available furnitures:", error);
        }
    }

    const savePlacement = async (placement, roomId) => {

        try {

            await axios.post(BACK_URL + `/placement/register`, {
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

            await axios.delete(BACK_URL + `/placement/delete?placementId=${placementId}`)
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