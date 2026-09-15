const axios = require('axios');
const env = require('../config/env');
const logger = require('../utils/logger');

/**
 * Weather & precipitation forecasting integration client
 */
class WeatherClient {
  constructor() {
    this.apiUrl = env.WEATHER_API_URL;
    this.apiKey = env.WEATHER_API_KEY;
  }

  /**
   * Fetch current and forecast weather data for given coordinates
   *
   * @param {number} latitude
   * @param {number} longitude
   */
  async getWeatherForCoordinates(latitude, longitude) {
    if (!this.apiKey || this.apiKey === 'demo_weather_api_key') {
      return this._getSimulatedWeatherData(latitude, longitude);
    }

    try {
      const response = await axios.get(`${this.apiUrl}/weather`, {
        params: {
          lat: latitude,
          lon: longitude,
          appid: this.apiKey,
          units: 'metric',
        },
        timeout: 4000,
      });

      const data = response.data;
      return {
        temperatureC: data.main?.temp ?? 22,
        humidityPct: data.main?.humidity ?? 75,
        pressureHpa: data.main?.pressure ?? 1013,
        rainfallLastHourMm: data.rain?.['1h'] ?? 0,
        rainfallLast3hMm: data.rain?.['3h'] ?? 0,
        weatherCondition: data.weather?.[0]?.main ?? 'Clouds',
        isSimulated: false,
      };
    } catch (error) {
      logger.warn(`External weather API call failed: ${error.message}. Returning fallback weather.`);
      return this._getSimulatedWeatherData(latitude, longitude);
    }
  }

  _getSimulatedWeatherData(latitude, longitude) {
    return {
      temperatureC: 18.5,
      humidityPct: 82.0,
      pressureHpa: 1008.2,
      rainfallLastHourMm: 12.4,
      rainfallLast3hMm: 34.8,
      weatherCondition: 'Heavy Rain',
      isSimulated: true,
      location: { latitude, longitude },
    };
  }
}

module.exports = new WeatherClient();
