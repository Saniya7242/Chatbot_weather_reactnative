import axios from 'axios';
import { WeatherData, WeatherError, SearchLocation, WeatherForecast, ForecastDay } from '../types/weather';

const API_KEY = '07ef59c1b194744498d3e294330b6bab';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export class WeatherService {
  static async getWeatherByLocation(location: string): Promise<WeatherData> {
    try {
      const response = await axios.get(`${BASE_URL}/weather`, {
        params: {
          q: location,
          appid: API_KEY,
          units: 'metric'
        }
      });
      
      // Transform OpenWeather data to our format
      const data = response.data;
      return {
        location: {
          name: data.name,
          country: data.sys.country,
          region: data.name,
          lat: data.coord.lat,
          lon: data.coord.lon,
          timezone_id: 'UTC',
          localtime: new Date(data.dt * 1000).toISOString()
        },
        current: {
          observation_time: new Date(data.dt * 1000).toLocaleTimeString(),
          temperature: Math.round(data.main.temp),
          weather_code: data.weather[0].id,
          weather_icons: [`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`],
          weather_descriptions: [data.weather[0].description],
          wind_speed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
          wind_degree: data.wind.deg,
          wind_dir: this.getWindDirection(data.wind.deg),
          pressure: data.main.pressure,
          precip: data.rain ? data.rain['1h'] || 0 : 0,
          humidity: data.main.humidity,
          cloudcover: data.clouds.all,
          feelslike: Math.round(data.main.feels_like),
          uv_index: 0, // OpenWeather doesn't provide UV in free tier
          visibility: data.visibility / 1000, // Convert to km
          is_day: data.dt > data.sys.sunrise && data.dt < data.sys.sunset ? 'yes' : 'no'
        }
      };
    } catch (error) {
      throw new Error('Failed to fetch weather data');
    }
  }

  static async getWeatherForecast(location: string): Promise<WeatherForecast> {
    try {
      const response = await axios.get(`${BASE_URL}/forecast`, {
        params: {
          q: location,
          appid: API_KEY,
          units: 'metric'
        }
      });
      
      // Transform OpenWeather forecast data to our format
      const data = response.data;
      const forecastDays: ForecastDay[] = [];
      
      // Group forecast by day (OpenWeather provides 3-hour intervals)
      const dailyData = this.groupForecastByDay(data.list);
      
      // Filter out today and get next 5 days
      const today = new Date().toDateString();
      const futureDays = dailyData.filter(dayData => {
        const dayDate = new Date(dayData[0].dt * 1000).toDateString();
        return dayDate !== today;
      });
      
      futureDays.slice(0, 5).forEach((dayData, index) => {
        const date = new Date(dayData[0].dt * 1000);
        const maxTemp = Math.max(...dayData.map(item => item.main.temp_max));
        const minTemp = Math.min(...dayData.map(item => item.main.temp_min));
        const avgTemp = dayData.reduce((sum, item) => sum + item.main.temp, 0) / dayData.length;
        const maxWind = Math.max(...dayData.map(item => item.wind.speed * 3.6));
        const totalPrecip = dayData.reduce((sum, item) => sum + (item.rain ? item.rain['3h'] || 0 : 0), 0);
        const avgHumidity = dayData.reduce((sum, item) => sum + item.main.humidity, 0) / dayData.length;
        
        // Get most common weather condition for the day
        const weatherCounts: { [key: string]: number } = {};
        dayData.forEach(item => {
          const condition = item.weather[0].description;
          weatherCounts[condition] = (weatherCounts[condition] || 0) + 1;
        });
        const mostCommonWeather = Object.keys(weatherCounts).reduce((a, b) => 
          weatherCounts[a] > weatherCounts[b] ? a : b
        );
        const weatherItem = dayData.find(item => item.weather[0].description === mostCommonWeather);
        
        forecastDays.push({
          date: date.toISOString().split('T')[0],
          day: {
            maxtemp_c: Math.round(maxTemp),
            mintemp_c: Math.round(minTemp),
            avgtemp_c: Math.round(avgTemp),
            maxwind_kph: Math.round(maxWind),
            totalprecip_mm: Math.round(totalPrecip),
            avghumidity: Math.round(avgHumidity),
            condition: {
              text: mostCommonWeather,
              icon: `https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png`,
              code: weatherItem.weather[0].id
            }
          },
          astro: {
            sunrise: new Date(data.city.sunrise * 1000).toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: true 
            }),
            sunset: new Date(data.city.sunset * 1000).toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: true 
            })
          }
        });
      });
      
      return {
        location: {
          name: data.city.name,
          country: data.city.country,
          region: data.city.name,
          lat: data.city.coord.lat,
          lon: data.city.coord.lon,
          timezone_id: 'UTC',
          localtime: new Date().toISOString()
        },
        forecast: {
          forecastday: forecastDays
        }
      };
    } catch (error) {
      throw new Error('Failed to fetch forecast data');
    }
  }

  static async getHourlyForecast(location: string): Promise<any[]> {
    try {
      const response = await axios.get(`${BASE_URL}/forecast`, {
        params: {
          q: location,
          appid: API_KEY,
          units: 'metric'
        }
      });
      
      // Get next 24 hours of hourly data (3-hour intervals)
      const hourlyData = response.data.list.slice(0, 8).map((item: any) => ({
        time: new Date(item.dt * 1000).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }),
        temp: Math.round(item.main.temp),
        icon: this.getWeatherIcon(item.weather[0].id),
        condition: item.weather[0].description,
        humidity: item.main.humidity,
        windSpeed: Math.round(item.wind.speed * 3.6)
      }));
      
      return hourlyData;
    } catch (error) {
      throw new Error('Failed to fetch hourly forecast data');
    }
  }

  static async searchLocation(query: string): Promise<SearchLocation[]> {
    try {
      const response = await axios.get(`https://api.openweathermap.org/geo/1.0/direct`, {
        params: {
          q: query,
          limit: 5,
          appid: API_KEY
        }
      });
      
      return response.data.map((item: any, index: number) => ({
        id: index + 1,
        name: item.name,
        region: item.state || '',
        country: item.country,
        lat: item.lat,
        lon: item.lon,
        url: `https://api.openweathermap.org/data/2.5/weather?q=${item.name}&appid=${API_KEY}&units=metric`
      }));
    } catch (error) {
      throw new Error('Failed to search location');
    }
  }

  static async getWeatherByCoords(lat: number, lon: number): Promise<WeatherData> {
    try {
      const response = await axios.get(`${BASE_URL}/weather`, {
        params: {
          lat: lat,
          lon: lon,
          appid: API_KEY,
          units: 'metric'
        }
      });
      
      // Transform OpenWeather data to our format (same as getWeatherByLocation)
      const data = response.data;
      return {
        location: {
          name: data.name,
          country: data.sys.country,
          region: data.name,
          lat: data.coord.lat,
          lon: data.coord.lon,
          timezone_id: 'UTC',
          localtime: new Date(data.dt * 1000).toISOString()
        },
        current: {
          observation_time: new Date(data.dt * 1000).toLocaleTimeString(),
          temperature: Math.round(data.main.temp),
          weather_code: data.weather[0].id,
          weather_icons: [`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`],
          weather_descriptions: [data.weather[0].description],
          wind_speed: Math.round(data.wind.speed * 3.6),
          wind_degree: data.wind.deg,
          wind_dir: this.getWindDirection(data.wind.deg),
          pressure: data.main.pressure,
          precip: data.rain ? data.rain['1h'] || 0 : 0,
          humidity: data.main.humidity,
          cloudcover: data.clouds.all,
          feelslike: Math.round(data.main.feels_like),
          uv_index: 0,
          visibility: data.visibility / 1000,
          is_day: data.dt > data.sys.sunrise && data.dt < data.sys.sunset ? 'yes' : 'no'
        }
      };
    } catch (error) {
      throw new Error('Failed to fetch weather data');
    }
  }

  // Helper methods
  private static getWindDirection(degrees: number): string {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  }

  private static groupForecastByDay(forecastList: any[]): any[][] {
    const grouped: { [key: string]: any[] } = {};
    forecastList.forEach(item => {
      const date = new Date(item.dt * 1000).toDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(item);
    });
    return Object.values(grouped);
  }

  private static getWeatherIcon(weatherCode: number): string {
    const icons: { [key: number]: string } = {
      200: '⚡', // Thunderstorm
      201: '⚡',
      202: '⚡',
      210: '⚡',
      211: '⚡',
      212: '⚡',
      221: '⚡',
      230: '⚡',
      231: '⚡',
      232: '⚡',
      300: '🌦️', // Drizzle
      301: '🌦️',
      302: '🌦️',
      310: '🌦️',
      311: '🌦️',
      312: '🌦️',
      313: '🌦️',
      314: '🌦️',
      321: '🌦️',
      500: '🌧️', // Rain
      501: '🌧️',
      502: '🌧️',
      503: '🌧️',
      504: '🌧️',
      511: '🌨️',
      520: '🌧️',
      521: '🌧️',
      522: '🌧️',
      531: '🌧️',
      600: '🌨️', // Snow
      601: '🌨️',
      602: '🌨️',
      611: '🌨️',
      612: '🌨️',
      613: '🌨️',
      615: '🌨️',
      616: '🌨️',
      620: '🌨️',
      621: '🌨️',
      622: '🌨️',
      701: '🌫️', // Atmosphere
      711: '🌫️',
      721: '🌫️',
      731: '🌫️',
      741: '🌫️',
      751: '🌫️',
      761: '🌫️',
      762: '🌫️',
      771: '🌫️',
      781: '🌫️',
      800: '☀️', // Clear
      801: '⛅', // Clouds
      802: '☁️',
      803: '☁️',
      804: '☁️',
    };
    
    return icons[weatherCode] || '🌤️';
  }
}
