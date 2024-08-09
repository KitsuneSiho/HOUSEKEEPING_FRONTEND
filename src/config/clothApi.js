import apiClient from "./axiosConfig.js";

export const uploadCloth = async (cloth, file) => {
    try {
        // 파일이 존재할 경우 multipart/form-data로 처리
        if (file) {
            const formData = new FormData();
            formData.append('file', file);

            // cloth 객체의 다른 데이터도 FormData에 추가
            Object.keys(cloth).forEach(key => formData.append(key, cloth[key]));

            const response = await apiClient.post('/ware/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return response.data;
        } else {
            // 파일이 없을 경우 일반 JSON 형태로 전송
            const response = await apiClient.post('/ware/upload', cloth);
            return response.data;
        }
    } catch (error) {
        throw error.response.data || 'Failed to upload cloth';
    }

};

