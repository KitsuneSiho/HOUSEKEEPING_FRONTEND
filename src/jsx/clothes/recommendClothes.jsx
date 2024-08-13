export const recommendClothes = (temperature) => {
    const topOptions = ['반팔', '긴팔', '셔츠', '민소매', '카라티', '니트'];
    const outerOptions = ['후드 집업', '가디건', '코트', '패딩', '바람막이'];
    const bottomOptions = ['반바지', '긴바지', '스커트', '원피스'];
    const bagOptions = ['백팩', '크로스백', '토트백', '숄더백', '웨이스트백'];
    const shoesOptions = ['운동화', '스니커즈', '구두', '샌들/슬리퍼'];
    const accessoryOptions = ['모자', '양말', '선글라스'];

    const recommendations = {
        outer: [],
        top: [],
        bottom: [],
        bag: [],
        shoes: [],
        accessory: []
    };

    // 온도에 따른 의상 추천 로직
    if (temperature >= 28) {
        recommendations.top.push(topOptions[0], topOptions[2]); // 반팔, 셔츠
        recommendations.bottom.push(bottomOptions[0], bottomOptions[2]); // 반바지, 스커트
        recommendations.bag.push(bagOptions[0], bagOptions[2]);
        recommendations.shoes.push(shoesOptions[3]); // 샌들/슬리퍼
        recommendations.accessory.push(accessoryOptions[0], accessoryOptions[2]); // 모자, 선글라스
    } else if (temperature >= 23 && temperature < 28) {
        recommendations.top.push(topOptions[0], topOptions[2]); // 반팔, 셔츠
        recommendations.bottom.push(bottomOptions[0], bottomOptions[1]); // 반바지, 긴바지
        recommendations.bag.push(bagOptions[0], bagOptions[2]);
        recommendations.shoes.push(shoesOptions[0]); // 운동화
    } else if (temperature >= 17 && temperature < 23) {
        recommendations.top.push(topOptions[1], topOptions[4]); // 긴팔, 카라티
        recommendations.outer.push(outerOptions[0], outerOptions[4]); // 후드 집업, 바람막이
        recommendations.bag.push(bagOptions[0], bagOptions[2]);
    } else if (temperature >= 12 && temperature < 17) {
        recommendations.top.push(topOptions[1], topOptions[5]); // 긴팔, 니트
        recommendations.outer.push(outerOptions[1], outerOptions[2]); // 가디건, 코트
        recommendations.bag.push(bagOptions[0], bagOptions[2]);
    } else if (temperature >= 5 && temperature < 12) {
        recommendations.outer.push(outerOptions[2], outerOptions[3]); // 코트, 패딩
        recommendations.top.push(topOptions[5]); // 니트
        recommendations.bag.push(bagOptions[0], bagOptions[2]);
    } else if (temperature < 5) {
        recommendations.outer.push(outerOptions[3], outerOptions[2]); // 패딩, 코트
        recommendations.accessory.push(accessoryOptions[0], accessoryOptions[1]); // 모자, 양말
        recommendations.bag.push(bagOptions[0], bagOptions[2]);
    }

    return recommendations;
};
