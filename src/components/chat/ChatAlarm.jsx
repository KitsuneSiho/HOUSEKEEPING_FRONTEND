import {useSocket} from "../context/SocketContext.jsx";
import {useEffect} from "react";

const ChatAlarm = () => {

    const {receivedMessage, setReceivedMessage, messageSender, setMessageSender} = useSocket();

    useEffect(() => {

        if (receivedMessage !== "" && messageSender !== "") {
            console.log("messageSender:", messageSender, "receivedMessage:", receivedMessage);

            setReceivedMessage("");
            setMessageSender("");
        }

    }, [receivedMessage, messageSender]);

    return (
        <>

        </>
    )
}

export default ChatAlarm;