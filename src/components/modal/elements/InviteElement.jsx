import PropTypes from "prop-types";
import styles from '../../../css/chat/inviteElement.module.css';

const InviteElement = ({users, type, selectedFriends, handleCheckboxChange}) => {

    return (
        <>
            {users.map((roomMember, index) => (
                    <div className={styles.userElement} key={index}>
                        <img
                            className={styles.profile}
                            src={roomMember.profileImageUrl || "/lib/profileImg.svg"}
                            alt="Profile Image"
                        />
                        <div className="user-nickname">{roomMember.nickname}</div>
                        {type === "invite" &&
                            <input
                                type="checkbox"
                                className={"invite-checkbox"}
                                    checked={selectedFriends.some(selectedFriend => selectedFriend.userId === roomMember.userId)}
                                onChange={() => {
                                    handleCheckboxChange({
                                    userId: roomMember.userId,
                                    nickname: roomMember.nickname,
                                });
                                }}
                            />
                        }
                    </div>
                )
            )}
        </>
    )
}

InviteElement.propTypes = {
    users: PropTypes.array,
    type: PropTypes.string,
    selectedFriends: PropTypes.array,
    handleCheckboxChange: PropTypes.func,
}

export default InviteElement