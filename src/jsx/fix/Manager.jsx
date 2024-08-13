import React, { useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import styles from '../../css/fix/manager.module.css';

// Chart.js에 필요한 컴포넌트 등록
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const Manager = () => {
    const [activeSection, setActiveSection] = useState('dashboard');
    const [selectedPost, setSelectedPost] = useState(null);

    // 차트에 사용할 샘플 데이터
    const userData = {
        labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월'],
        datasets: [
            {
                label: '신규 사용자',
                data: [65, 59, 80, 81, 56, 55, 40],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const postData = {
        labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월'],
        datasets: [
            {
                label: '루미`s Tip',
                data: [28, 48, 40, 19, 86, 27, 90],
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1,
            },
            {
                label: '폐기물 Tip',
                data: [35, 50, 60, 55, 80, 45, 70],
                backgroundColor: 'rgba(255, 159, 64, 0.2)',
                borderColor: 'rgba(255, 159, 64, 1)',
                borderWidth: 1,
            },
            {
                label: '생활 Tip',
                data: [50, 65, 75, 85, 95, 100, 120],
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
        ],
    };

    const guestbookData = {
        labels: ['홍길동', '김철수', '이영희', '박민수'],
        datasets: [
            {
                label: '받은 방명록 수',
                data: [120, 90, 60, 30],
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
            },
        ],
    };

    // 사용자 및 게시물 데이터 (샘플)
    const users = [
        { id: 1, name: '홍길동', email: 'hong@example.com', nickname: '길동이', phone: '010-1234-5678', platform: '카카오', level: '5' },
        { id: 2, name: '김철수', email: 'kim@example.com', nickname: '철수', phone: '010-2345-6789', platform: '구글', level: '3' },
        { id: 3, name: '이영희', email: 'lee@example.com', nickname: '영희', phone: '010-3456-7890', platform: '네이버', level: '4' },
        { id: 4, name: '박민수', email: 'park@example.com', nickname: '민수', phone: '010-4567-8901', platform: '애플', level: '2' },
    ];

    const posts = [
        { id: 1, title: '첫 번째 게시물', author: '홍길동', board: '게시판 1', time: '2024-01-01 12:00', content: '첫 번째 게시물의 내용입니다.' },
        { id: 2, title: '두 번째 게시물', author: '김철수', board: '게시판 2', time: '2024-02-01 14:30', content: '두 번째 게시물의 내용입니다.' },
        { id: 3, title: 'React 팁과 요령', author: '이영희', board: '게시판 3', time: '2024-03-01 16:45', content: 'React 팁과 요령에 대한 게시물입니다.' },
        { id: 4, title: 'JavaScript 이해하기', author: '박민수', board: '게시판 1', time: '2024-04-01 18:00', content: 'JavaScript를 이해하는 방법에 대한 게시물입니다.' },
    ];

    const comments = [
        { id: 1, postTitle: '김김김', author: '김철수', content: '좋은 글입니다.', time: '2024-01-02 12:30' },
        { id: 2, postTitle: '이이이', author: '이영희', content: '동의합니다.', time: '2024-01-02 13:00' },
        { id: 3, postTitle: '박박박', author: '박민수', content: '유익한 정보네요.', time: '2024-02-02 14:00' },
        { id: 4, postTitle: '홍홍홍', author: '홍길동', content: '잘 읽었습니다.', time: '2024-03-02 15:00' },
    ];

    // 회원 탈퇴 기능
    const handleDeleteUser = (userId) => {
        if (window.confirm('정말로 이 사용자를 탈퇴시키겠습니까?')) {
            // 여기에 실제 탈퇴 로직을 추가
            console.log(`User with ID ${userId} has been deleted.`);
        }
    };

    // 게시물 삭제 기능
    const handleDeletePost = (postId) => {
        if (window.confirm('정말로 이 게시물을 삭제하시겠습니까?')) {
            // 여기에 실제 게시물 삭제 로직을 추가
            console.log(`Post with ID ${postId} has been deleted.`);
        }
    };

    // 댓글 삭제 기능
    const handleDeleteComment = (commentId) => {
        if (window.confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
            // 여기에 실제 댓글 삭제 로직을 추가
            console.log(`Comment with ID ${commentId} has been deleted.`);
        }
    };

    // 게시물 클릭 시 상세 내용 표시
    const handlePostClick = (post) => {
        setSelectedPost(post);
    };

    // 모달 닫기
    const closeModal = () => {
        setSelectedPost(null);
    };

    // 사용자 선택에 따라 섹션을 렌더링하는 함수
    const renderSection = () => {
        switch (activeSection) {
            case 'dashboard':
                return (
                    <div className={styles.chartContainer}>
                        <div className={styles.chartBox}>
                            <h2>사용자 증가</h2>
                            <Line data={userData} options={{ responsive: true }} />
                        </div>
                        <div className={styles.chartBox}>
                            <h2>게시물 활동</h2>
                            <Bar data={postData} options={{ responsive: true }} />
                        </div>
                        <div className={styles.chartBox}>
                            <h2>방명록 많이 받은 사용자</h2>
                            <Bar data={guestbookData} options={{ responsive: true }} />
                        </div>
                    </div>
                );
            case 'users':
                return (
                    <div className={styles.userManagement}>
                        <h2>사용자 관리</h2>
                        <table className={styles.userTable}>
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>이름</th>
                                <th>이메일</th>
                                <th>닉네임</th>
                                <th>전화번호</th>
                                <th>가입 플랫폼</th>
                                <th>레벨</th>
                                <th>탈퇴</th>
                            </tr>
                            </thead>
                            <tbody>
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.nickname}</td>
                                    <td>{user.phone}</td>
                                    <td>{user.platform}</td>
                                    <td>{user.level}</td>
                                    <td>
                                        <button
                                            onClick={() => handleDeleteUser(user.id)}
                                            className={styles.deleteButton}
                                        >
                                            탈퇴
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                );
            case 'posts':
                return (
                    <div className={styles.postManagement}>
                        <h2>게시물 관리</h2>
                        <table className={styles.postTable}>
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>제목</th>
                                <th>작성자</th>
                                <th>게시판</th>
                                <th>시간</th>
                                <th>삭제</th>
                            </tr>
                            </thead>
                            <tbody>
                            {posts.map(post => (
                                <tr key={post.id}>
                                    <td>{post.id}</td>
                                    <td>
                                        <button onClick={() => handlePostClick(post)} className={styles.linkButton}>
                                            {post.title}
                                        </button>
                                    </td>
                                    <td>{post.author}</td>
                                    <td>{post.board}</td>
                                    <td>{post.time}</td>
                                    <td>
                                        <button
                                            onClick={() => handleDeletePost(post.id)}
                                            className={styles.deleteButton}
                                        >
                                            삭제
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                );
            case 'comments':
                return (
                    <div className={styles.commentManagement}>
                        <h2>댓글 관리</h2>
                        <table className={styles.commentTable}>
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>게시물 제목</th>
                                <th>작성자</th>
                                <th>내용</th>
                                <th>시간</th>
                                <th>삭제</th>
                            </tr>
                            </thead>
                            <tbody>
                            {comments.map(comment => (
                                <tr key={comment.id}>
                                    <td>{comment.id}</td>
                                    <td>{comment.postTitle}</td>
                                    <td>{comment.author}</td>
                                    <td>{comment.content}</td>
                                    <td>{comment.time}</td>
                                    <td>
                                        <button
                                            onClick={() => handleDeleteComment(comment.id)}
                                            className={styles.deleteButton}
                                        >
                                            삭제
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className={styles.managerContainer}>
            <div className={styles.managerHeader}>
                <img src="/lib/HouseKeeping로고.png" alt="House Keeping 로고"/>
            </div>
            <nav className={styles.navbar}>
                <button onClick={() => setActiveSection('dashboard')}>대시보드</button>
                <button onClick={() => setActiveSection('users')}>사용자 관리</button>
                <button onClick={() => setActiveSection('posts')}>게시물 관리</button>
                <button onClick={() => setActiveSection('comments')}>댓글 관리</button>
            </nav>
            <div className={styles.content}>
                {renderSection()}
            </div>

            {selectedPost && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h2>{selectedPost.title}</h2>
                        <p><strong>작성자:</strong> {selectedPost.author}</p>
                        <p><strong>게시판:</strong> {selectedPost.board}</p>
                        <p><strong>시간:</strong> {selectedPost.time}</p>
                        <p><strong>내용:</strong> {selectedPost.content}</p>
                        <button onClick={closeModal} className={styles.closeButton}>닫기</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Manager;
