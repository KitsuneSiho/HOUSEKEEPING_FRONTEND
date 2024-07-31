import axios from 'axios';

const BACK_URL = "http://localhost:8080"; // 백엔드 서버 URL

const apiClient = axios.create({
    baseURL: BACK_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default apiClient;
