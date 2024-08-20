import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../css/tip/roomeTip.module.css';
import Footer from '../../jsx/fix/Footer.jsx';
import axiosInstance from '../../config/axiosInstance.js';

const RoomeTip = () => {
    const navigate = useNavigate();
    const [searchVisible, setSearchVisible] = useState(false);
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [sortOption, setSortOption] = useState('latest');
    const [searchKeyword, setSearchKeyword] = useState('');

    const fetchPosts = useCallback(async () => {
        try {
            const response = await axiosInstance.get('/api/posts');
            const roomePosts = response.data.filter(post => post.category === 'ROOME');

            if (sortOption === 'latest') {
                roomePosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            } else if (sortOption === 'popular') {
                roomePosts.sort((a, b) => b.viewCount - a.viewCount);
            }

            setPosts(roomePosts);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    }, [sortOption]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    useEffect(() => {
        filterPosts();
    }, [posts, searchKeyword]);

    const filterPosts = useCallback(() => {
        if (searchKeyword.trim() === '') {
            setFilteredPosts(posts);
        } else {
            const filtered = posts.filter(post =>
                post.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                post.content.toLowerCase().includes(searchKeyword.toLowerCase())
            );
            setFilteredPosts(filtered);
        }
    }, [posts, searchKeyword]);

    const toggleSearchBar = () => {
        setSearchVisible(!searchVisible);
    };

    const handleSortChange = (e) => {
        setSortOption(e.target.value);
    };

    const handleSearchChange = (e) => {
        setSearchKeyword(e.target.value);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getFullYear().toString().substr(-2)}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
    };

    const incrementViewAndNavigate = useCallback(async (postId) => {
        try {
            await axiosInstance.get(`/api/posts/${postId}/view`);
            navigate(`/tip/roome/detail/${postId}`);
        } catch (error) {
            console.error('Error incrementing view count:', error);
            navigate(`/tip/roome/detail/${postId}`);
        }
    }, [navigate]);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <img className={styles.back} src="/lib/back.svg" alt="back" onClick={() => navigate('/tip')} />
                <h2>루미`s Tip</h2>
                <img className={styles.searchIcon}
                     src="/lib/검색.svg"
                     alt="search"
                     id="search-icon"
                     onClick={toggleSearchBar}
                />
            </div>
            <div className={`${styles.searchBar} ${searchVisible ? styles.visible : ''}`} id="search-bar">
                <input
                    type="text"
                    placeholder="검색어를 입력하세요"
                    id="search-input"
                    value={searchKeyword}
                    onChange={handleSearchChange}
                />
            </div>

            <div className={styles.postContainer}>
                <div className={styles.sortOptions}>
                    <select value={sortOption} onChange={handleSortChange}>
                        <option value="latest">최신순</option>
                        <option value="popular">인기순</option>
                    </select>
                </div>
                <div className={styles.postList}>
                    {filteredPosts.map((post) => (
                        <div key={post.id} className={styles.postItem} onClick={() => incrementViewAndNavigate(post.id)}>
                            <div className={styles.postContent}>{post.title}</div>
                            <div className={styles.postInfo}>
                                <span>{formatDate(post.createdAt)}</span>
                                <span>조회수: {post.viewCount}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className={styles.createButton} onClick={() => navigate('/tip/roome/post')}>
                    <img src="/lib/연필.svg" alt="write" />
                    <span>작성</span>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default RoomeTip;