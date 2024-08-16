// DetermineHowWash.js
export const DetermineHowWash = (clothType, clothMaterial) => {
    if (clothMaterial === '면') {
        if (['셔츠', '반팔', '긴팔', '후드 집업', '가디건', '반바지', '긴바지', '스커트', '원피스'].includes(clothType)) {
            return '찬물에 세탁기 세탁, 저온 건조';
        } else if (clothType === '니트') {
            return '손세탁 권장, 평평하게 건조';
        } else if (['코트', '패딩'].includes(clothType)) {
            return '전문 세탁 추천';
        } else if (['백팩', '크로스백', '토트백', '숄더백', '웨이스트백'].includes(clothType)) {
            return '가방 세탁 전용 세제 사용';
        } else if (['운동화', '스니커즈'].includes(clothType)) {
            return '찬물에 세탁기 세탁, 신발 전용 세제 사용';
        } else if (clothType === '구두') {
            return '전문 세탁 추천, 물세탁 금지';
        } else if (clothType === '샌들/슬리퍼') {
            return '손세탁 또는 물로 닦기';
        } else if (clothType === '모자') {
            return '손세탁, 형태 유지';
        } else if (clothType === '양말') {
            return '찬물에 세탁기 세탁, 저온 건조';
        } else if (clothType === '선글라스') {
            return '부드러운 천으로 닦기';
        }
    } else if (clothMaterial === '폴리에스터') {
        if (['바람막이', '셔츠', '반팔', '긴팔', '반바지', '긴바지', '스커트', '원피스'].includes(clothType)) {
            return '찬물에 세탁기 세탁, 저온 건조';
        } else if (clothType === '패딩') {
            return '전문 세탁 추천';
        } else if (['백팩', '크로스백', '토트백', '숄더백', '웨이스트백'].includes(clothType)) {
            return '가방 세탁 전용 세제 사용';
        } else if (['운동화', '스니커즈'].includes(clothType)) {
            return '찬물에 세탁기 세탁, 신발 전용 세제 사용';
        } else if (clothType === '구두') {
            return '전문 세탁 추천, 물세탁 금지';
        } else if (clothType === '샌들/슬리퍼') {
            return '손세탁 또는 물로 닦기';
        } else if (clothType === '모자') {
            return '손세탁, 형태 유지';
        } else if (clothType === '양말') {
            return '찬물에 세탁기 세탁, 저온 건조';
        } else if (clothType === '선글라스') {
            return '부드러운 천으로 닦기';
        }
    } else if (clothMaterial === '나일론') {
        if (['바람막이', '반바지', '긴바지', '스커트', '원피스'].includes(clothType)) {
            return '찬물에 세탁기 세탁, 저온 건조';
        } else if (clothType === '패딩') {
            return '전문 세탁 추천';
        } else if (['백팩', '크로스백', '토트백', '숄더백', '웨이스트백'].includes(clothType)) {
            return '가방 세탁 전용 세제 사용';
        } else if (['운동화', '스니커즈'].includes(clothType)) {
            return '찬물에 세탁기 세탁, 신발 전용 세제 사용';
        } else if (clothType === '구두') {
            return '전문 세탁 추천, 물세탁 금지';
        } else if (clothType === '샌들/슬리퍼') {
            return '손세탁 또는 물로 닦기';
        } else if (clothType === '모자') {
            return '손세탁, 형태 유지';
        } else if (clothType === '양말') {
            return '찬물에 세탁기 세탁, 저온 건조';
        } else if (clothType === '선글라스') {
            return '부드러운 천으로 닦기';
        }
    } else if (clothMaterial === '울') {
        return '손세탁 권장, 건조기 사용 금지';
    } else if (clothMaterial === '실크') {
        return '찬물에 손세탁, 그늘에서 말림';
    } else if (clothMaterial === '가죽') {
        return '전문 세탁 추천';
    } else {
        return '일반 세탁';
    }
    return '일반 세탁'; // 기본 세탁 방법
};
