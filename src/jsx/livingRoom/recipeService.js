
import axiosConfig from "../../config/axiosConfig.js";

//API 호출 담당
export const searchRecipe = async (query) => {
    try {
        const response = await axiosConfig.post(`/api/recipe-search`, query);

        if (response.data && response.data.error) {
            throw new Error(response.data.error);
        }
        return response.data;
    } catch (error) {
        throw error;
    }
};