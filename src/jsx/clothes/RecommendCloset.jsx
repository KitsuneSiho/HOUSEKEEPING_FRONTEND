import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../css/clothes/recommendCloset.module.css';
import Footer from '../../jsx/fix/Footer.jsx';
import apiClient from '../../config/axiosConfig';
import { recommendClothes } from "./recommendClothes.jsx";


const RecommendCloset = () => {
    const navigate = useNavigate();
    const [city, setCity] = useState('');
    const [cityName, setCityName] = useState('');
    const [date, setDate] = useState('');
    const [weather, setWeather] = useState(null);
    const [selectedTime, setSelectedTime] = useState('');
    const [bgColor, setBgColor] = useState('royalblue'); // 기본 배경색
    const [customTemperature, setCustomTemperature] = useState(''); // 사용자 입력 온도 상태
    const [recommendations, setRecommendations] = useState({
        top: [],
        bottom: [],
        outer: [],
        shoes: [],
        bag: [],
        accessory: []
    });


    // userId 변수 정의
    //const userId = localStorage.getItem('userId'); // 예시: localStorage에서 가져오기
    const userId = localStorage.getItem('userId');
    console.log("유저 id:", userId);


    useEffect(() => {
        const today = new Date();
        const todayDate = today.toISOString().split('T')[0];
        setDate(todayDate);
        navigator.geolocation.getCurrentPosition((position) => {
            const {latitude, longitude} = position.coords;
            getCityName(latitude, longitude);
            fetchWeatherForecast(latitude, longitude);
        });
    }, []);

    useEffect(() => {
        // 날씨 정보가 갱신될 때마다 배경색 업데이트 및 추천 불러오기
        if (weather && date && selectedTime) {
            const selectedDate = new Date(date);
            const forecast = weather.list.find((item) => {
                const forecastDate = new Date(item.dt_txt);
                const forecastTime = forecastDate.toTimeString().split(' ')[0].substring(0, 5);
                return forecastDate.toDateString() === selectedDate.toDateString() && forecastTime === selectedTime;
            });
            if (forecast) {
                updateBgColor(forecast.weather[0].description); // 배경색 업데이트
                fetchRecommendations(Math.round(forecast.main.temp));
            }
        }
    }, [weather, date, selectedTime]);

    const fetchWeatherForecast = async (lat, lon) => {
        try {
            const response = await apiClient.get(`/api/weather/forecast?lat=${lat}&lon=${lon}`);
            setWeather(response.data);
            setDefaultTime(response.data.list);
        } catch (error) {
            console.error('Error fetching weather data', error);
        }
    };

    //--------------------------------------------------------------------

    // JWT 토큰에서 user_id 추출 함수
    const parseJwt = (token) => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error("JWT 토큰 파싱 중 오류 발생:", error);
            return null;
        }
    };

    const fetchRecommendations = async (temperature) => {
        const access = localStorage.getItem('access');

        if (!access) {
            console.error("토큰이 없습니다. 로그인 페이지로 이동합니다.");
            navigate('/login');
            return;
        }

        // 토큰에서 user_id 추출
        const decodedToken = parseJwt(access);
        let userId; // 기본 userId
        if (decodedToken && decodedToken.userId) {
            userId = decodedToken.userId;
        }

        console.log("유저 id:", userId);

        try {
            const response = await apiClient.get(`/ware/recommend?temperature=${temperature}&user_id=${userId}`, {
                headers: {
                    Authorization: `Bearer ${access}`
                }
            });
            console.log("응답 데이터:", response.data); // 백엔드에서 받은 데이터를 콘솔에 출력


            const serverRecommendations = response.data;
            if (serverRecommendations && serverRecommendations.length > 0) {
                const newRecommendations = {
                    top: [],
                    bottom: [],
                    outer: [],
                    shoes: [],
                    bag: [],
                    accessory: []
                };

                serverRecommendations.forEach(item => {
                    switch(item.clothType) {
                        case '반팔':
                        case '셔츠':
                        case '니트':
                        case '민소매':
                        case '긴팔':
                            newRecommendations.top.push(item);
                            break;
                        case '반바지':
                        case '긴바지':
                        case '스커트':
                        case '원피스':
                            newRecommendations.bottom.push(item);
                            break;
                        case '코트':
                        case '패딩':
                        case '가디건':
                        case '후드 집업':
                            newRecommendations.outer.push(item);
                            break;
                        case '운동화':
                        case '구두':
                        case '샌들/슬리퍼':
                            newRecommendations.shoes.push(item);
                            break;
                        case '백팩':
                        case '크로스백':
                            newRecommendations.bag.push(item);
                            break;
                        case '모자':
                        case '양말':
                        case '선글라스':
                            newRecommendations.accessory.push(item);
                            break;
                        default:
                            console.warn(`Unknown clothType: ${item.clothType}`);
                    }
                });

                setRecommendations(newRecommendations);
                console.log("추천 설정:", newRecommendations);
            } else {
                const localRecommendations = recommendClothes(temperature);
                setRecommendations(localRecommendations);
            }
        } catch (error) {
            console.error("옷 추천 데이터를 가져오는 중 오류 발생:", error);
            const localRecommendations = recommendClothes(temperature);
            setRecommendations(localRecommendations);
        }
    };

// -----------------------------------------옷추천----------------------------------------------

    const setDefaultTime = (forecastList) => {
        const now = new Date();
        const closestTime = forecastList.find(item => new Date(item.dt_txt) > now);
        if (closestTime) {
            const timeString = new Date(closestTime.dt_txt).toTimeString().split(' ')[0].substring(0, 5);
            setSelectedTime(timeString);
        }
    };


    const getCityName = async (lat, lon) => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`);
            const data = await response.json();
            setCityName(data.address.city || data.address.town || data.address.village || "현재 위치");
        } catch (error) {
            console.error('Error fetching city name', error);
        }
    };

    const handleCityChange = async (e) => {
        const selectedCity = e.target.value;
        setCity(selectedCity);
        const cityCoordinates = {
            서울: {lat: 37.5665, lon: 126.9780},
            인천: {lat: 37.4563, lon: 126.7052},
            경기도: {lat: 37.4138, lon: 127.5183},
            강원도: {lat: 37.8228, lon: 128.1555},
            충청북도: {lat: 36.6350, lon: 127.4914},
            충청남도: {lat: 36.5184, lon: 126.8000},
            경상북도: {lat: 36.5756, lon: 128.5056},
            경상남도: {lat: 35.2598, lon: 128.6647},
            전라북도: {lat: 35.7175, lon: 127.1530},
            전라남도: {lat: 34.8194, lon: 126.8930},
            제주도: {lat: 33.4890, lon: 126.4983},
        };

        if (selectedCity in cityCoordinates) {
            const {lat, lon} = cityCoordinates[selectedCity];
            fetchWeatherForecast(lat, lon);
            setCityName(selectedCity);
        } else {
            navigator.geolocation.getCurrentPosition((position) => {
                const {latitude, longitude} = position.coords;
                getCityName(latitude, longitude);
                fetchWeatherForecast(latitude, longitude);
            });
        }
    };

    const handleDateChange = (e) => {
        const selectedDate = e.target.value;
        setDate(selectedDate);
    };

    const handleTimeChange = (e) => {
        setSelectedTime(e.target.value);
    };

    const getWeatherForDateAndTime = () => {
        if (!weather || !date || !selectedTime) return null;

        let selectedDate = new Date(date);
        if (selectedTime === '21:00') {
            selectedDate.setDate(selectedDate.getDate() - 1); // 날짜를 하루 줄임
        }

        const forecast = weather.list.find((item) => {
            const forecastDate = new Date(item.dt_txt);
            const forecastTime = forecastDate.toTimeString().split(' ')[0].substring(0, 5);
            return forecastDate.toDateString() === selectedDate.toDateString() && forecastTime === selectedTime;
        });

        return forecast ? (
            <div className={styles.weatherInfo}>
                <img className={styles.weatherIcon}
                     src={`http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`} alt="weather icon"/>
                <p className={styles.weatherDescription}>{translateWeatherDescription(forecast.weather[0].id)}</p>
                <div className={styles.weatherDetails}>
                    <p>{selectedDate.toLocaleDateString('ko-KR', {month: 'long', day: 'numeric', weekday: 'long'})}</p>
                    <p>{cityName}</p>
                    <p>{Math.round(forecast.main.temp)}°C</p>
                    <p>{getFormattedDate(new Date(new Date(forecast.dt_txt).getTime() + 6 * 60 * 60 * 1000))} 기준</p> {/* 아이콘에 한국 시간 반영 */}
                </div>
            </div>
        ) : (
            <p>해당 날짜의 날씨 정보를 찾을 수 없습니다.</p>
        );
    };

    const translateWeatherDescription = (description) => {
        const weatherDescKo = {
            201: "가벼운 비를 동반한 천둥구름",
            200: "비를 동반한 천둥구름",
            202: "폭우를 동반한 천둥구름",
            210: "약한 천둥구름",
            211: "천둥구름",
            212: "강한 천둥구름",
            221: "불규칙적 천둥구름",
            230: "약한 연무를 동반한 천둥구름",
            231: "연무를 동반한 천둥구름",
            232: "강한 안개비를 동반한 천둥구름",
            300: "가벼운 안개비",
            301: "안개비",
            302: "강한 안개비",
            310: "가벼운 적은비",
            311: "적은비",
            312: "강한 적은비",
            313: "소나기와 안개비",
            314: "강한 소나기와 안개비",
            321: "소나기",
            500: "악한 비",
            501: "중간 비",
            502: "강한 비",
            503: "매우 강한 비",
            504: "극심한 비",
            511: "우박",
            520: "약한 소나기 비",
            521: "소나기 비",
            522: "강한 소나기 비",
            531: "불규칙적 소나기 비",
            600: "가벼운 눈",
            601: "눈",
            602: "강한 눈",
            611: "진눈깨비",
            612: "소나기 진눈깨비",
            615: "약한 비와 눈",
            616: "비와 눈",
            620: "약한 소나기 눈",
            621: "소나기 눈",
            622: "강한 소나기 눈",
            701: "박무",
            711: "연기",
            721: "연무",
            731: "모래 먼지",
            741: "안개",
            751: "모래",
            761: "먼지",
            762: "화산재",
            771: "돌풍",
            781: "토네이도",
            800: "구름 한 점 없는 맑은 하늘",
            801: "약간의 구름이 낀 하늘",
            802: "드문드문 구름이 낀 하늘",
            803: "구름이 거의 없는 하늘",
            804: "구름으로 뒤덮인 흐린 하늘",
            900: "토네이도",
            901: "태풍",
            902: "허리케인",
            903: "한랭",
            904: "고온",
            905: "바람부는 날씨",
            906: "우박",
            951: "바람이 거의 없는 날씨",
            952: "약한 바람",
            953: "부드러운 바람",
            954: "중간 세기 바람",
            955: "신선한 바람",
            956: "센 바람",
            957: "돌풍에 가까운 센 바람",
            958: "돌풍",
            959: "심각한 돌풍",
            960: "폭풍",
            961: "강한 폭풍",
            962: "허리케인",
        };
        return weatherDescKo[description] || '날씨 정보 없음';
    };

    const updateBgColor = (description) => {
        const weatherBgColors = {
            "clear sky": "royalblue",               // 맑은 하늘 - 로열블루
            "few clouds": "dodgerblue",              // 약간의 구름 - 라이트블루
            "scattered clouds": "slategray",         // 드문드문 구름 - 슬레이트 그레이 (짙은 회색+파랑)
            "broken clouds": "cornflowerblue",   // 구름이 거의 없는 하늘 - 라이트스틸블루 (회색+파랑 조합)
            "overcast clouds": "darkslategray",     // 흐린 하늘 - 다크 슬레이트 그레이 (짙은 회색+약간의 파랑)
            "rain": "darkgray",                     // 비 - 다크 그레이
            "snow": "white",                        // 눈 - 화이트
            "mist": "lightgray",                    // 박무 - 라이트 그레이
            "fog": "gainsboro",                     // 안개 - 게인스보로 (밝은 회색)
            "thunderstorm": "dimgray",              // 천둥번개 - 딤 그레이
            "drizzle": "cadetblue",                 // 이슬비 - 캐딧블루 (회색+파랑)
            "shower rain": "darkslateblue",         // 소나기 - 다크 슬레이트 블루 (짙은 회색+파랑)
            "hail": "lightsteelblue",               // 우박 - 라이트스틸블루 (회색+파랑 조합)
        };
        setBgColor(weatherBgColors[description] || 'royalblue');
    };

    const getMaxDate = () => {
        const today = new Date();
        const maxDate = new Date(today);
        maxDate.setDate(today.getDate() + 5);
        return maxDate.toISOString().split('T')[0];
    };

    const getMinDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    const getFormattedDate = (date) => {
        // const kstDate = new Date(date.getTime() + 1 * 60 * 60 * 1000); // 한국 시간으로 변환
        // return kstDate.toLocaleDateString('ko-KR', {
        return date.toLocaleDateString('ko-KR', {
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false  // 24시간 형식으로 설정
        }).replace(/\./g, '');

    };


// 시간 옵션을 원래 값으로 정의합니다.
    const timeOptions = ['21:00','00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00'];

// 시간을 6시간 더한 값으로 표시하는 함수
    const getDisplayTime = (time) => {
        const [hours, minutes] = time.split(':').map(Number);
        const adjustedHours = (hours + 6) % 24;  // 6시간 더하기 및 24시간 형식 유지
        return `${String(adjustedHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    };




    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <img className={styles.back} src="/lib/back.svg" alt="back" onClick={() => navigate('/closet')}/>
                <h2>Dress Room</h2>
            </div>
            <div className={styles.weather} style={{backgroundColor: bgColor}}>
                {weather ? getWeatherForDateAndTime() : <p>날씨 정보를 불러오는 중...</p>}
            </div>
            <div className={styles.selection}>
                <label htmlFor="region">지역 선택:</label>
                <select id="region" value={city} onChange={handleCityChange}>
                    <option value="">현재 위치</option>
                    <option value="서울">서울</option>
                    <option value="인천">인천</option>
                    <option value="경기도">경기도</option>
                    <option value="강원도">강원도</option>
                    <option value="충청북도">충청북도</option>
                    <option value="충청남도">충청남도</option>
                    <option value="경상북도">경상북도</option>
                    <option value="경상남도">경상남도</option>
                    <option value="전라북도">전라북도</option>
                    <option value="전라남도">전라남도</option>
                    <option value="제주도">제주도</option>
                </select>
                <label htmlFor="date">날짜 선택:</label>
                <input type="date" id="date" name="date" value={date} onChange={handleDateChange} min={getMinDate()}
                       max={getMaxDate()}/>
            </div>
            <div className={styles.selection}>
                <label htmlFor="time">시간 선택:</label>
                <select id="time" value={selectedTime} onChange={handleTimeChange}>
                    {timeOptions.map(time => (
                        <option key={time} value={time}>{getDisplayTime(time)}</option>
                    ))}
                </select>

                <input
                    type="number"
                    placeholder="온도 입력 (°C)"
                    value={customTemperature}
                    onChange={(e) => setCustomTemperature(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            fetchRecommendations(customTemperature);
                        }
                    }}
                    className={styles.customTempInput}
                />
                <button
                    onClick={() => fetchRecommendations(customTemperature)}
                    className={styles.customTempButton}
                >
                    입력 온도별 추천
                </button>
            
            </div>
            <div className={styles.recommendationsContainer}>
                <div className={styles.imageCategoryTopCategory}>
                    {recommendations.top?.map((recommendation, index) => (
                        <img key={index} src={recommendation.imageUrl} alt={recommendation.item} className={styles.itemTop}/>
                    ))}
                </div>

                <div className={styles.imageCategoryBottomCategory}>
                    {recommendations.bottom?.map((recommendation, index) => (
                        <img key={index} src={recommendation.imageUrl} alt={recommendation.item}
                             className={styles.itemBottom}/>
                    ))}
                </div>

                <div className={styles.imageCategoryOuterCategory}>
                    {recommendations.outer?.map((recommendation, index) => (
                        <img key={index} src={recommendation.imageUrl} alt={recommendation.item}
                             className={styles.itemOuter}/>
                    ))}
                </div>

                <div className={styles.imageCategoryShoesCategory}>
                    {recommendations.shoes?.map((recommendation, index) => (
                        <img key={index} src={recommendation.imageUrl} alt={recommendation.item}
                             className={styles.itemShoes}/>
                    ))}
                </div>

                <div className={styles.imageCategoryBagCategory}>
                    {recommendations.bag?.map((recommendation, index) => (
                        <img key={index} src={recommendation.imageUrl} alt={recommendation.item} className={styles.itemBag}/>
                    ))}
                </div>

                <div className={styles.imageCategoryAccessoryCategory}>
                    {recommendations.accessory?.map((recommendation, index) => (
                        <img key={index} src={recommendation.imageUrl} alt={recommendation.item}
                             className={styles.itemAccessory}/>
                    ))}
                </div>
            </div>


            <Footer/>
        </div>
    );
};

export default RecommendCloset;