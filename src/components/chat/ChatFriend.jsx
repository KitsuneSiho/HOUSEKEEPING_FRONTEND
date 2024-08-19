import styles from "../../css/chat/createChat.module.css";
import PropTypes from "prop-types";
import React from "react";

// 친구 element
const ChatFriend = ({index, friend, selectedFriends, handleCheckboxChange}) => {

    return (
        <>
            <div key={index} className={styles.friendItem}>
                <img src={friend.profileImageUrl} alt={`/lib/profileImg.svg`}/>
                <div className={styles.friendInfo}>
                    <div className={styles.friendName}>{friend.nickname}</div>
                </div>
                <input
                    type="checkbox"
                    className={styles.friendCheckbox}
                    checked={selectedFriends.includes(friend.userId)}
                    onChange={() => {
                        handleCheckboxChange(friend.userId, friend.nickname);
                    }}
                />
            </div>
        </>
    )
}

ChatFriend.propTypes = {
    index: PropTypes.number,
    friend: PropTypes.object,
    selectedFriends: PropTypes.arrayOf(PropTypes.number),
    handleCheckboxChange: PropTypes.func,
}

export default ChatFriend