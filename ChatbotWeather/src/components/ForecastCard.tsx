import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { ForecastDay } from '../types/weather';

const { width } = Dimensions.get('window');

interface ForecastCardProps {
  forecast: ForecastDay;
}

const ForecastCard: React.FC<ForecastCardProps> = ({ forecast }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    
    // Get the day name (Sun, Mon, Tue, Wed, Thu, Fri, Sat)
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return dayNames[date.getDay()];
  };

  const getWeatherIcon = (weatherCode: number) => {
    const icons: { [key: number]: string } = {
      113: '☀️', // Sunny
      116: '⛅', // Partly cloudy
      119: '☁️', // Cloudy
      122: '☁️', // Overcast
      143: '🌫️', // Mist
      176: '🌦️', // Patchy rain
      179: '🌨️', // Patchy snow
      182: '🌨️', // Patchy sleet
      185: '🌨️', // Patchy freezing drizzle
      200: '⛈️', // Thundery outbreaks
      227: '🌨️', // Blowing snow
      230: '❄️', // Blizzard
      248: '🌫️', // Fog
      260: '🌨️', // Freezing fog
      263: '🌦️', // Patchy light drizzle
      266: '🌦️', // Light drizzle
      281: '🌨️', // Freezing drizzle
      284: '🌨️', // Heavy freezing drizzle
      293: '🌦️', // Patchy light rain
      296: '🌦️', // Light rain
      299: '🌧️', // Moderate rain at times
      302: '🌧️', // Moderate rain
      305: '🌧️', // Heavy rain at times
      308: '🌧️', // Heavy rain
      311: '🌨️', // Light freezing rain
      314: '🌨️', // Moderate or heavy freezing rain
      317: '🌨️', // Light sleet
      320: '🌨️', // Moderate or heavy sleet
      323: '🌨️', // Patchy light snow
      326: '🌨️', // Light snow
      329: '🌨️', // Patchy moderate snow
      332: '🌨️', // Moderate snow
      335: '🌨️', // Patchy heavy snow
      338: '🌨️', // Heavy snow
      350: '🌨️', // Ice pellets
      353: '🌦️', // Light rain shower
      356: '🌧️', // Moderate or heavy rain shower
      359: '🌧️', // Torrential rain shower
      362: '🌨️', // Light sleet showers
      365: '🌨️', // Moderate or heavy sleet showers
      368: '🌨️', // Light snow showers
      371: '🌨️', // Moderate or heavy snow showers
      374: '🌨️', // Light showers of ice pellets
      377: '🌨️', // Moderate or heavy showers of ice pellets
      386: '⛈️', // Patchy light rain with thunder
      389: '⛈️', // Moderate or heavy rain with thunder
      392: '⛈️', // Patchy light snow with thunder
      395: '⛈️', // Moderate or heavy snow with thunder
    };
    
    return icons[weatherCode] || '🌤️';
  };

  return (
    <View style={styles.card}>
      <Text style={styles.dayText}>{formatDate(forecast.date)}</Text>
      
      <View style={styles.iconContainer}>
        <Text style={styles.weatherIcon}>
          {getWeatherIcon(forecast.day.condition.code)}
        </Text>
      </View>
      
      <Text style={styles.conditionText}>{forecast.day.condition.text}</Text>
      
      <View style={styles.temperatureContainer}>
        <Text style={styles.maxTemp}>{Math.round(forecast.day.maxtemp_c)}°</Text>
        <Text style={styles.minTemp}>{Math.round(forecast.day.mintemp_c)}°</Text>
      </View>
      
      <View style={styles.detailsContainer}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Wind</Text>
          <Text style={styles.detailValue}>{Math.round(forecast.day.maxwind_kph)} km/h</Text>
        </View>
        
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Rain</Text>
          <Text style={styles.detailValue}>{forecast.day.totalprecip_mm}mm</Text>
        </View>
      </View>
      
      <View style={styles.astroContainer}>
        <View style={styles.astroItem}>
          <Text style={styles.astroIcon}>🌅</Text>
          <Text style={styles.astroText}>{forecast.astro.sunrise}</Text>
        </View>
        <View style={styles.astroItem}>
          <Text style={styles.astroIcon}>🌇</Text>
          <Text style={styles.astroText}>{forecast.astro.sunset}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 8,
    minWidth: width * 0.35,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  dayText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  iconContainer: {
    marginBottom: 8,
  },
  weatherIcon: {
    fontSize: 40,
  },
  conditionText: {
    fontSize: 12,
    color: '#e0e0e0',
    textAlign: 'center',
    marginBottom: 12,
    textTransform: 'capitalize',
  },
  temperatureContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  maxTemp: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 8,
  },
  minTemp: {
    fontSize: 16,
    color: '#ccc',
  },
  detailsContainer: {
    width: '100%',
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 10,
    color: '#ccc',
  },
  detailValue: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '500',
  },
  astroContainer: {
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    paddingTop: 8,
  },
  astroItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  astroIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  astroText: {
    fontSize: 10,
    color: '#ccc',
  },
});

export default ForecastCard;
