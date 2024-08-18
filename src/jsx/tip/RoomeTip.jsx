import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../css/tip/roomeTip.module.css';
import Footer from '../../jsx/fix/Footer.jsx';
import axiosInstance from '../../config/axiosInstance.js';
import { useAuth } from '../../contexts/AuthContext';

const RoomeTip = () => {
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await axiosInstance.get('/api/posts/category/ROOME');
            if (Array.isArray(response.data)) {
                setPosts(response.data);
            } else {
                console.error('Received data is not an array:', response.data);
                setPosts([]);
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
            setPosts([]);
        }
    };

    const toggleSearchBar = () => {
        setIsSearchVisible(!isSearchVisible);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <img className={styles.back} src="/lib/back.svg" alt="back" onClick={() => navigate('/tip')} />
                <h2>루미`s Tip</h2>
                <img src="/lib/검색.svg" alt="search" className={styles.searchIcon} onClick={toggleSearchBar} />
            </div>

            <div className={`${styles.searchBar} ${isSearchVisible ? styles.visible : ''}`} id={styles.searchBar}>
                <input type="text" placeholder="검색어를 입력하세요" id={styles.searchInput} />
            </div>

            <div className={styles.postContainer}>
                <div className={styles.sortOptions}>
                    <select>
                        <option value="latest">최신순</option>
                        <option value="popular">인기순</option>
                    </select>
                </div>

                <div className={styles.postList}>
                    {posts.map(post => (
                        <div key={post.id} className={styles.postItem}>
                            <div className={styles.postContent}
                                 onClick={() => navigate(`/tip/roome/detail/${post.id}`)}>
                                {post.title}
                            </div>
                            <div className={styles.postInfo}>
                                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                <span>{post.authorName || '익명'}</span>
                            </div>
                        </div>
                    ))}
                </div>
                {user && user.role === 'ROLE_ADMIN' && (
                    <div className={styles.createButton} onClick={() => navigate('/tip/roome/create')}>
                        <img src="/lib/연필.svg" alt="write"/>
                        <span>작성</span>
                    </div>
                )}
            </div>
            <Footer/>
        </div>
    );
};

export default RoomeTip;