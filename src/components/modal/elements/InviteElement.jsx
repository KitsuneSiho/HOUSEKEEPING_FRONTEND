import PropTypes from "prop-types";

const InviteElement = ({users, type, selectedFriends, handleCheckboxChange}) => {

    return (
        <>
            {users.map((roomMember, index) => (
                    <div className="user-element" key={index}>
                        <img className="user-image" src={users.userImage} alt="profile"/>
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