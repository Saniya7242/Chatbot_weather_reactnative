export interface WeatherData {
  location: {
    name: string;
    country: string;
    region: string;
    lat: number;
    lon: number;
    timezone_id: string;
    localtime: string;
  };
  current: {
    observation_time: string;
    temperature: number;
    weather_code: number;
    weather_icons: string[];
    weather_descriptions: string[];
    wind_speed: number;
    wind_degree: number;
    wind_dir: string;
    pressure: number;
    precip: number;
    humidity: number;
    cloudcover: number;
    feelslike: number;
    uv_index: number;
    visibility: number;
    is_day: string;
  };
}

export interface ForecastDay {
  date: string;
  day: {
    maxtemp_c: number;
    mintemp_c: number;
    avgtemp_c: number;
    maxwind_kph: number;
    totalprecip_mm: number;
    avghumidity: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
  };
  astro: {
    sunrise: string;
    sunset: string;
  };
}

export interface WeatherForecast {
  location: {
    name: string;
    country: string;
    region: string;
    lat: number;
    lon: number;
    timezone_id: string;
    localtime: string;
  };
  forecast: {
    forecastday: ForecastDay[];
  };
}

export interface WeatherError {
  error: {
    code: number;
    type: string;
    info: string;
  };
}

export interface SearchLocation {
  id: number;
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  url: string;
}
