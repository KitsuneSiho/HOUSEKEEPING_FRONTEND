import PropTypes from "prop-types";
import React from "react";

const InviteElement = ({users, type, selectedFriends, handleCheckboxChange}) => {

    return (
        <>
            {users.map((roomMember, index) => (
                    <div className="user-element" key={index}>
                        <img src={roomMember.profileImageUrl} alt={`/lib/profileImg.svg`}/>
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