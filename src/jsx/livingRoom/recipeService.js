import axios from 'axios';
import { BACK_URL } from "../../Constraints.js";

//API 호출 담당
export const searchRecipe = async (query) => {
    console.log('searchRecipe 함수 호출됨, query:', query);
    try {
        console.log('API 요청 시작');
        const response = await axios.post(`${BACK_URL}/api/recipe-search`, query);
        console.log('API 응답:', response.data);

        if (response.data && response.data.error) {
            throw new Error(response.data.error);
        }

        console.log("받은 데이터", response.data);

        return response.data;
    } catch (error) {
        console.error('API 요청 중 오류 발생:', error);
        throw error;
    }
};