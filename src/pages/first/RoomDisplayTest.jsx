import {useEffect, useState} from "react";
import axios from "axios";
import {BACK_URL} from "../../Constraints.js";
import RoomModel from "../../components/room/RoomModel.jsx";

const RoomDisplayTest = () => {

    const [userId, setUserId] = useState("");
    const [rooms, setRooms] = useState([]);
    const [placementLists, setPlaceLists] = useState([]);
    const [isReady, setReady] = useState(false);

    useEffect(() => {
        setUserId(sessionStorage.getItem("userId"));
    }, []);

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

    return (
        <>
            {isReady && rooms.map((room, index) => (
                <div key={index}>
                    <RoomModel room={room} placementList={placementLists[index]}/>
                </div>
            ))}
        </>
    )
}

export default RoomDisplayTest