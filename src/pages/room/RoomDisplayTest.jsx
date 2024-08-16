import {useEffect, useState} from "react";
import RoomModel from "../../components/room/RoomModel.jsx";
import {useLogin} from "../../contexts/AuthContext.jsx";
import axiosInstance from "../../config/axiosInstance.js";

const RoomDisplayTest = () => {

    const {user} = useLogin();
    const [rooms, setRooms] = useState([]);
    const [placementLists, setPlacementLists] = useState([]);
    const [isReady, setReady] = useState(false);

    useEffect(() => {

        if (user !== null) {

            getRoomIds();
        }
    }, [user])

    useEffect(() => {

        if (JSON.stringify(rooms) !== JSON.stringify([])) {
            getPlacementLists().then(() => setReady(true));
        }
    }, [rooms])

    const getRoomIds = async () => {

        try {

            const response = await axiosInstance.get(`/room/list?userId=${user.userId}`);

            setRooms(response.data);
            console.log(response.data);
        } catch (error) {
            console.error("Error fetching room:", error);
        }
    }

    const getPlacementLists = async () => {

        try {

            const response = await axiosInstance.get(`/placement/list/all?roomIds=${rooms[0].roomId}&roomIds=${rooms[1].roomId}&roomIds=${rooms[2].roomId}`);

            setPlacementLists(response.data);
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