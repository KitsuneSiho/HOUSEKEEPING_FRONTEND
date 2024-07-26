import {useSocket} from "../context/SocketContext.jsx";

const ChatPrototype = () => {
    const {room, setRoom, joinRoom, leaveRoom, messages, message, setMessage, sendMessage} = useSocket();

    return (
        <div>
            <h1>Socket.IO Chat</h1>
            <input
                type="text"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                placeholder="Enter room name"
            />
            <button onClick={joinRoom}>Join Room</button>
            <button onClick={leaveRoom}>Leave Room</button>
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>{msg}</div>
                ))}
            </div>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message"
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default ChatPrototype;
