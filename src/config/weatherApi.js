import apiClient from "./axiosConfig.js";

const getWeatherForecast = async (lat, lon) => {
    try {
        const response = await apiClient.get(`/api/weather/forecast?lat=${lat}&lon=${lon}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching weather forecast data", error);
        throw error;
    }
};

export default getWeatherForecast;