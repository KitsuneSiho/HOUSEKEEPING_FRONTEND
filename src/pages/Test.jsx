import axiosInstance from "../config/axiosInstance.js";
import {useEffect, useState} from "react";

const Test = () => {

    const [response, setResponse] = useState([]);

    useEffect(() => {
        testAxios();
    }, []);

    const testAxios = async () => {

        try {

            const response = await axiosInstance(`/room/list?userId=6`);
            setResponse(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            <div>
                {response.length > 0 && (
                    response.map((item, index) => (
                        <div key={index}>{item.roomName}</div>
                    ))
                )}
            </div>
        </>
    )
}

export default Test;