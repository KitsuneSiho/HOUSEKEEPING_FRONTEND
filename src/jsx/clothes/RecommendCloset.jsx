import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../css/clothes/recommendCloset.module.css';
import Footer from '../../jsx/fix/Footer.jsx';
import apiClient from '../../api/axiosConfig';

const RecommendCloset = () => {
    const navigate = useNavigate();
    const [city, setCity] = useState('');
    const [cityName, setCityName] = useState('');
    const [date, setDate] = useState('');
    const [weather, setWeather] = useState(null);
    const [selectedTime, setSelectedTime] = useState('');

    useEffect(() => {
        const today = new Date();
        const todayDate = today.toISOString().split('T')[0];
        setDate(todayDate);
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            getCityName(latitude, longitude);
            fetchWeatherForecast(latitude, longitude);
        });
    }, []);

    const fetchWeatherForecast = async (lat, lon) => {
        try {
            const response = await apiClient.get(`/api/weather/forecast?lat=${lat}&lon=${lon}`);
            setWeather(response.data);
            setDefaultTime(response.data.list);
        } catch (error) {
            console.error('Error fetching weather data', error);
        }
    };

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
            서울: { lat: 37.5665, lon: 126.9780 },
            인천: { lat: 37.4563, lon: 126.7052 },
            경기도: { lat: 37.4138, lon: 127.5183 },
            강원도: { lat: 37.8228, lon: 128.1555 },
            충청북도: { lat: 36.6350, lon: 127.4914 },
            충청남도: { lat: 36.5184, lon: 126.8000 },
            경상북도: { lat: 36.5756, lon: 128.5056 },
            경상남도: { lat: 35.2598, lon: 128.6647 },
            전라북도: { lat: 35.7175, lon: 127.1530 },
            전라남도: { lat: 34.8194, lon: 126.8930 },
            제주도: { lat: 33.4890, lon: 126.4983 },
        };

        if (selectedCity in cityCoordinates) {
            const { lat, lon } = cityCoordinates[selectedCity];
            fetchWeatherForecast(lat, lon);
            setCityName(selectedCity);
        } else {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
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
        const selectedDate = new Date(date);
        const forecast = weather.list.find((item) => {
            const forecastDate = new Date(item.dt_txt);
            const forecastTime = forecastDate.toTimeString().split(' ')[0].substring(0, 5);
            return forecastDate.toDateString() === selectedDate.toDateString() && forecastTime === selectedTime;
        });
        return forecast ? (
            <div className={styles.weatherInfo}>
                <img className={styles.weatherIcon}
                     src={`http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`} alt="weather icon"/>
                <p className={styles.weatherDescription}>{translateWeatherDescription(forecast.weather[0].description)}</p>
                <div className={styles.weatherDetails}>
                    <p>{selectedDate.toLocaleDateString('ko-KR', {month: 'long', day: 'numeric', weekday: 'long'})}</p>
                    <p>{cityName}</p>
                    <p>{Math.round(forecast.main.temp)}°C</p>
                    <p> {getFormattedDate(new Date(forecast.dt_txt))} 기준</p>
                </div>
            </div>
        ) : (
            <p>해당 날짜의 날씨 정보를 찾을 수 없습니다.</p>
        );
    };

    const translateWeatherDescription = (description) => {
        const weatherDescKo = {
            "clear sky": "구름 한 점 없는 맑은 하늘",
            "few clouds": "약간의 구름이 낀 하늘",
            "scattered clouds": "드문드문 구름이 낀 하늘",
            "broken clouds": "구름이 거의 없는 하늘",
            "overcast clouds": "구름으로 뒤덮인 흐린 하늘",
            "rain": "비",
            "snow": "눈",
            "mist": "박무",
            "fog": "안개",
        };
        return weatherDescKo[description] || '날씨 정보 없음';
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
        return date.toLocaleDateString('ko-KR', {
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }).replace(/\./g, '').replace('오전', 'AM').replace('오후', 'PM');
    };

    const timeOptions = ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <img className={styles.back} src="/lib/back.svg" alt="back" onClick={() => navigate('/closet')} />
                <h2>Dress Room</h2>
            </div>
            <div className={styles.weather}>
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
                <input type="date" id="date" name="date" value={date} onChange={handleDateChange} min={getMinDate()} max={getMaxDate()} />
                <label htmlFor="time">시간 선택:</label>
                <select id="time" value={selectedTime} onChange={handleTimeChange}>
                    {timeOptions.map(time => (
                        <option key={time} value={time}>{time}</option>
                    ))}
                </select>
            </div>
            <div className={styles.recommendations}>
                <img src="/lib/추천옷.svg" alt="추천 옷 1" />
                <img src="/lib/추천옷.svg" alt="추천 옷 2" />
            </div>
            <Footer />
        </div>
    );
};

export default RecommendCloset;
