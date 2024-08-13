import axios from 'axios';

const BACK_URL = 'http://localhost:8080';

const apiClient = axios.create({
    baseURL: BACK_URL,
    withCredentials: true, // CORS 요청 시 쿠키를 함께 보내기 위함
});

// 요청 인터셉터: 요청을 보내기 전에 토큰을 헤더에 추가
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 응답 인터셉터: 응답에서 401 에러(토큰 만료 등) 발생 시 처리
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                // 액세스 토큰 재발급 요청
                const response = await axios.post(`${BACK_URL}/reissue`, {}, {withCredentials: true});

                const Authorization = response.headers['authorization'];

                const newAccessToken = Authorization.split(' ')[1];

                localStorage.setItem('access', newAccessToken);

                // 재시도할 요청에 새로운 토큰 적용
                originalRequest.headers['Authorization'] = Authorization;

                // 원래의 요청을 재시도
                return apiClient(originalRequest);
            } catch (refreshError) {
                // 재발급 실패 시 토큰 삭제 및 로그인 페이지로 리다이렉트
                // localStorage.removeItem('access');
                // window.location.href = '/login';

                console.log("refreshError", refreshError);

                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;
