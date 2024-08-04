import {useEffect, useState} from "react";
import axios from "axios";
import {BACK_URL} from "../../Constraints.js";
import EditRoom from "../../components/room/EditRoom.jsx";

const RoomEditTest = () => {

    const [userId, setUserId] = useState("");
    const [userLevel, setUserLevel] = useState("");
    const [rooms, setRooms] = useState([]);
    const [placementLists, setPlaceLists] = useState([]);
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

            setRooms(response.data);
            console.log(response.data);
        } catch (error) {
            console.error("Error fetching room:", error);
        }
    }

    const getPlacementLists = async () => {

        try {

            const response = await axios.get(BACK_URL + `/placement/list/all?roomIds=${rooms[0].roomId}&roomIds=${rooms[1].roomId}&roomIds=${rooms[2].roomId}`);

            setPlaceLists(response.data);
            console.log(response.data);
        } catch (error) {
            console.error("Error fetching placementLists", error);
        }
    }

    const getAvailableFurniture = async () => {

        try {

            const response = await axios.get(BACK_URL + `/furniture/list/${userLevel}`);

            setFurniture(response.data);
            console.log(response.data);
        } catch (error) {
            console.error("Error fetching available furnitures:", error);
        }
    }

    return (
        <>
            {isReady && <EditRoom room={rooms[0]} placementList={placementLists[0]} furniture={furniture} userLevel={userLevel} /> }
        </>
    )
}

export default RoomEditTest