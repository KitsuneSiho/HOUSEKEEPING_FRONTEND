import styles from "../../../css/chat/createChat.module.css";
import PropTypes from "prop-types";

const FriendElement = ({index, friend, selectedFriends, handleCheckboxChange, setSelectedNickname}) => {

    return (
        <>
            <div key={index} className={styles.friendItem}>
                <img src={friend.userImage} alt="profile"/>
                <div className={styles.friendInfo}>
                    <div className={styles.friendName}>{friend.nickname}</div>
                </div>
                <input
                    type="checkbox"
                    className={styles.friendCheckbox}
                    checked={selectedFriends.includes(friend.userId)}
                    onChange={() => {
                        handleCheckboxChange(friend.userId);
                        setSelectedNickname(friend.nickname);
                    }}
                />
            </div>
        </>
    )
}

FriendElement.propTypes = {
    index: PropTypes.number,
    friend: PropTypes.object,
    selectedFriends: PropTypes.arrayOf(PropTypes.number),
    handleCheckboxChange: PropTypes.func,
    setSelectedNickname: PropTypes.func,
}

export default FriendElement