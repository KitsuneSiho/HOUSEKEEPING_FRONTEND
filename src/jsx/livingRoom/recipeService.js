import axios from 'axios';
import { BACK_URL } from "../../Constraints.js";

export const searchRecipe = async (query) => {
    try {
        const response = await axios.post(`${BACK_URL}/api/recipe-search`, {
            query: query,
            topP: 0.8,
            topK: 0,
            maxTokens: 256,
            temperature: 0.5,
            repeatPenalty: 5.0,
            stopBefore: [],
            includeAiFilters: true,
            seed: 0
        });

        // API 응답을 파싱하여 레시피 정보 추출
        const recipeText = response.data.result.message.content;
        const recipe = parseRecipe(recipeText);

        return recipe;
    } catch (error) {
        console.error('API 요청 중 오류 발생:', error);
        throw error;
    }
};

const parseRecipe = (text) => {
    // 여기서 API 응답 텍스트를 파싱하여 구조화된 레시피 객체로 변환
    // 실제 구현은 API 응답 형식에 따라 달라질 수 있습니다
    const lines = text.split('\n');
    const recipe = {
        name: lines[0],
        ingredients: '',
        seasoning: '',
        cookingTime: '',
        instructions: ''
    };

    let currentSection = '';
    for (const line of lines.slice(1)) {
        if (line.includes('재료:')) {
            currentSection = 'ingredients';
            recipe.ingredients = line.replace('재료:', '').trim();
        } else if (line.includes('양념:')) {
            currentSection = 'seasoning';
            recipe.seasoning = line.replace('양념:', '').trim();
        } else if (line.includes('조리 시간:')) {
            recipe.cookingTime = line.replace('조리 시간:', '').trim();
        } else if (line.includes('만드는 방법:')) {
            currentSection = 'instructions';
        } else if (currentSection === 'instructions') {
            recipe.instructions += line.trim() + ' ';
        }
    }

    return recipe;
};