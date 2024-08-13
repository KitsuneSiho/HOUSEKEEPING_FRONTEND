export const colorMatches = {
    초록: ['검정', '회색', '흰색'],
    검정: ['초록', '회색', '흰색'],
    회색: ['초록', '검정', '흰색'],
    흰색: ['초록', '검정', '회색'],
};

export const getMatchingColors = (color) => colorMatches[color] || [];

export const recommendClothes = (season, temperature, color) => {
    const recommendations = {
        outer: [],
        top: [],
        bottom: [],
        bag: [],
        shoes: [],
        accessory: []
    };

    const topOptions = ['반팔', '긴팔', '셔츠', '민소매', '카라티', '니트'];
    const outerOptions = ['후드 집업', '가디건', '코트', '패딩', '바람막이'];
    const bottomOptions = ['반바지', '긴바지', '스커트', '원피스'];
    const bagOptions = ['백팩', '크로스백', '토트백', '숄더백', '웨이스트백'];
    const shoesOptions = ['운동화', '스니커즈', '구두', '샌들/슬리퍼'];
    const accessoryOptions = ['모자', '양말', '선글라스'];

    // 온도와 계절에 따른 의상 추천 로직
    if (season === 'SUMMER' && temperature >= 28) {
        recommendations.top.push(...topOptions.slice(0, 3)); // 반팔, 긴팔, 셔츠
        recommendations.bottom.push(...bottomOptions.slice(0, 2)); // 반바지, 스커트
        recommendations.shoes.push(...shoesOptions.slice(3)); // 샌들, 슬리퍼
        recommendations.accessory.push(...accessoryOptions.slice(0, 2)); // 모자, 선글라스
    } else if (season === 'SPRING_FALL' && temperature >= 17 && temperature < 23) {
        recommendations.outer.push(...outerOptions.slice(0, 2)); // 후드 집업, 가디건
        recommendations.top.push(...topOptions.slice(1, 4)); // 긴팔, 셔츠, 민소매
        recommendations.bottom.push(...bottomOptions.slice(2, 3)); // 청바지
        recommendations.shoes.push(...shoesOptions.slice(0, 2)); // 운동화, 스니커즈
        recommendations.accessory.push(...accessoryOptions.slice(0, 2)); // 스카프, 모자
    } else if (season === 'WINTER' && temperature < 12) {
        recommendations.outer.push(...outerOptions.slice(2, 4)); // 코트, 패딩
        recommendations.top.push(...topOptions.slice(4, 6)); // 카라티, 니트
        recommendations.bottom.push(bottomOptions[1]); // 긴바지
        recommendations.shoes.push(shoesOptions[2]); // 구두
        recommendations.accessory.push(...accessoryOptions.slice(0, 1)); // 목도리
    }

    // 온도에 따른 추가 의상 추천
    if (temperature < 5) {
        recommendations.outer.push('두꺼운 코트', '패딩');
        recommendations.accessory.push('목도리', '장갑', '귀마개');
    } else if (temperature >= 5 && temperature < 12) {
        recommendations.outer.push('코트', '가죽 재킷');
    } else if (temperature >= 12 && temperature < 17) {
        recommendations.outer.push('재킷', '야상');
        recommendations.top.push('스웨트 셔츠', '기모 후드티');
    } else if (temperature >= 17 && temperature < 23) {
        recommendations.top.push('후드티', '맨투맨');
    } else if (temperature >= 23 && temperature < 28) {
        recommendations.top.push('반팔 티셔츠', '얇은 셔츠');
        recommendations.bottom.push('반바지', '면바지');
    }

    // 색상에 따른 조합 추천
    const matchingColors = getMatchingColors(color);
    for (let category in recommendations) {
        recommendations[category] = recommendations[category].map(item => ({
            item,
            color: matchingColors[Math.floor(Math.random() * matchingColors.length)] || color
        }));
    }

    return recommendations;
};