import React, {useState, useEffect} from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import styles from '../../css/first/firstLogin.module.css';
import axiosInstance from "../../config/axiosInstance.js";
import {useLogin} from "../../contexts/AuthContext.jsx";

const FirstLogin = () => {

    const {user, setUser} = useLogin();
    const navigate = useNavigate();
    const location = useLocation();
    const [userInfo, setUserInfo] = useState({
        name: '',
        nickname: '',
        email: '',
        phoneNumber: '',
        userPlatform: '',
        role: 'ROLE_USER',
        username: '',
        profileImageUrl: ''
    });
    const [token, setToken] = useState('');
    const [nicknameError, setNicknameError] = useState('');
    const [authError, setAuthError] = useState('');
    const [profileImage, setProfileImage] = useState("/lib/profileImg.svg");

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const accessToken = params.get('token');
        setToken(accessToken);

        // 토큰을 로컬 스토리지에 저장
        if (accessToken) {
            localStorage.setItem('access', accessToken);
        }

        setUserInfo(prevState => ({
            ...prevState,
            name: decodeURIComponent(params.get('name') || ''),
            email: decodeURIComponent(params.get('email') || ''),
            phoneNumber: decodeURIComponent(params.get('phoneNumber') || ''),
            userPlatform: params.get('provider') || '',
            username: decodeURIComponent(params.get('email') || '')
        }));
    }, [location]);

    const handleInputChange = (e) => {
        const {id, value} = e.target;
        setUserInfo(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await axiosInstance.post('/files/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`
                    }
                });
                setProfileImage(response.data);
                setUserInfo(prevState => ({
                    ...prevState,
                    profileImageUrl: response.data
                }));
            } catch (error) {
                console.error('Error uploading image:', error);
                setAuthError('프로필 이미지 업로드에 실패했습니다.');
            }
        }
    };

    const handleSubmit = async () => {
        try {
            const response = await axiosInstance.post('/api/auth/complete-registration', {
                ...userInfo,
                profileImageUrl: profileImage
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (response.status === 200) {
                console.log("userId:", response.data.userId);
                setUser({
                    ...user,
                    ...response.data,
                    nickname: userInfo.nickname,
                    profileImageUrl: profileImage
                });
                createNewRooms(response.data.userId).then(() => navigate(`/mypage/myroom/edit/${true}`));
            }
        } catch (error) {
            console.error('Error completing registration', error);
            if (error.response) {
                if (error.response.status === 401) {
                    setAuthError('Unauthorized access. Please check your token.');
                } else if (error.response.data === "Nickname already exists") {
                    setNicknameError('이미 사용 중인 닉네임입니다.');
                } else {
                    setAuthError(error.response.data || 'An unexpected error occurred. Please try again later.');
                }
            } else {
                setAuthError('An unexpected error occurred. Please try again later.');
            }
        }
    };

    const createNewRooms = async (userId) => {

        try {

            const privateRoom = await axiosInstance.post(`/room/register`, {
                userId: userId,
                roomName: "내 방",
                roomType: "PRIVATE",
                roomPollution: 0,
                roomWallsColor: "{\"floor\":\"#f2e0c8\",\"leftWall\":\"#cdcdcd\",\"backWall\":\"#cdcdcd\"}"
            })

            placeFurniture(privateRoom.data.roomId);

            const kitchen = await axiosInstance.post(`/room/register`, {
                userId: userId,
                roomName: "부엌",
                roomType: "KITCHEN",
                roomPollution: 0,
                roomWallsColor: "{\"floor\":\"#f2e0c8\",\"leftWall\":\"#cdcdcd\",\"backWall\":\"#cdcdcd\"}"
            })

            placeFurniture(kitchen.data.roomId);

            const toilet = await axiosInstance.post(`/room/register`, {
                userId: userId,
                roomName: "화장실",
                roomType: "TOILET",
                roomPollution: 0,
                roomWallsColor: "{\"floor\":\"#f2e0c8\",\"leftWall\":\"#cdcdcd\",\"backWall\":\"#cdcdcd\"}"
            })

            placeFurniture(toilet.data.roomId);

        } catch (error) {
            console.error("error saving room:", error);
        }
    }

    const placeFurniture = async (roomId) => {

        try {

            await axiosInstance.post(`/placement/register`, {
                roomId: roomId,
                furnitureId: 1,
                placementLocation: JSON.stringify({x: -8.8, y: 10, z: 6}),
                placementAngle: 0,
                placementSize: 1.3,
            })
        } catch (error) {
            console.error("error placing furniture:", error);
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.firstLoginTitle}>
                <h1>가입 정보</h1>
            </div>
            <div className={styles.profileImg}>
                <img src={profileImage} alt="프로필 이미지"/>
                <label htmlFor="profileImageUpload">프로필 이미지 설정</label>
                <input
                    type="file"
                    id="profileImageUpload"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                />
            </div>
            <div className={styles.information}>
                <div className={styles.inputContainer}>
                    <label htmlFor="name">이름</label>
                    <input type="text" id="name" value={userInfo.name} readOnly/>
                </div>
                <div className={styles.inputContainer}>
                    <label htmlFor="nickname">닉네임</label>
                    <input type="text" id="nickname" value={userInfo.nickname} onChange={handleInputChange}/>
                    {nicknameError && <p className={styles.error}>{nicknameError}</p>}
                </div>
                <div className={styles.inputContainer}>
                    <label htmlFor="email">이메일</label>
                    <input type="text" id="email" value={userInfo.email} readOnly/>
                </div>
                <div className={styles.inputContainer}>
                    <label htmlFor="phoneNumber">전화번호</label>
                    <input
                        type="text"
                        id="phoneNumber"
                        value={userInfo.phoneNumber}
                        onChange={handleInputChange}
                        readOnly={userInfo.userPlatform !== 'GOOGLE'}
                    />
                </div>
                {authError && <p className={styles.error}>{authError}</p>}
            </div>
            <div className={styles.submit}>
                <button
                    type="button"
                    className={styles.cancel}
                    onClick={() => navigate('/login')}
                >취소
                </button>
                <button
                    type="button"
                    className={styles.next}
                    onClick={handleSubmit}
                >다음
                </button>
            </div>
        </div>
    );
};

export default FirstLogin;