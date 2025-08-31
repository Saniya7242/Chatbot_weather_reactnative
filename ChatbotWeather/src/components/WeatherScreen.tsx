import React, { useState } from 'react';
import ChatScreen from './ChatScreen';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Dimensions,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { WeatherData, WeatherForecast } from '../types/weather';
import { WeatherService } from '../services/weatherService';
import ForecastCard from './ForecastCard';

const { width, height } = Dimensions.get('window');

const WeatherScreen: React.FC = () => {
  const [location, setLocation] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<WeatherForecast | null>(null);
  const [hourlyData, setHourlyData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showChat, setShowChat] = useState(true);

  const searchWeather = async () => {
    if (!location.trim()) {
      Alert.alert('Error', 'Please enter a location');
      return;
    }

    setLoading(true);
    try {
      const [currentData, forecastData, hourlyForecast] = await Promise.all([
        WeatherService.getWeatherByLocation(location.trim()),
        WeatherService.getWeatherForecast(location.trim()),
        WeatherService.getHourlyForecast(location.trim())
      ]);
      
      setWeatherData(currentData);
      setForecastData(forecastData);
      setHourlyData(hourlyForecast);
      
      // Add to recent searches
      const newSearches = [location.trim(), ...recentSearches.filter(s => s !== location.trim())].slice(0, 5);
      setRecentSearches(newSearches);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (weatherCode: number) => {
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
  };

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    }
    
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getCurrentDate = () => {
    const now = new Date();
    return now.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'numeric',
      day: 'numeric'
    });
  };

  // Fallback hourly data if API fails
  const fallbackHourlyData = [
    { time: '1:00 AM', temp: 7, icon: '🌙', condition: 'Clear' },
    { time: '2:00 AM', temp: 8, icon: '🌙', condition: 'Clear' },
    { time: '3:00 AM', temp: 8, icon: '🌙', condition: 'Clear' },
    { time: '4:00 AM', temp: 8, icon: '☁️', condition: 'Cloudy' },
    { time: '5:00 AM', temp: 8, icon: '☁️', condition: 'Cloudy' },
    { time: '6:00 AM', temp: 7, icon: '☁️', condition: 'Cloudy' },
    { time: '7:00 AM', temp: 7, icon: '☁️', condition: 'Cloudy' },
  ];

  return (
    <LinearGradient
      colors={['#0a0a0a', '#1a1a2e', '#16213e', '#0f3460']}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.menuButton}>
            <Text style={styles.menuIcon}>☰</Text>
          </TouchableOpacity>
          
          <View style={styles.locationContainer}>
            <Text style={styles.locationText}>
              {weatherData ? weatherData.location.name : 'Weather App'}
            </Text>
            <Text style={styles.dateTimeText}>
              {weatherData ? formatDate(weatherData.location.localtime) : getCurrentDate()} {getCurrentTime()}
            </Text>
          </View>
          
                     <TouchableOpacity 
             style={styles.addButton}
             onPress={() => setShowChat(true)}
           >
             <Text style={styles.addIcon}>💬</Text>
           </TouchableOpacity>
        </View>

                 {/* Search Section */}
         <View style={styles.searchContainer}>
           <View style={styles.searchInputContainer}>
             <TextInput
               style={styles.searchInput}
               placeholder="Search location..."
               placeholderTextColor="rgba(255, 255, 255, 0.5)"
               value={location}
               onChangeText={setLocation}
               onSubmitEditing={searchWeather}
             />
             {location.length > 0 && (
               <TouchableOpacity
                 style={styles.clearButton}
                 onPress={() => setLocation('')}
               >
                 <Text style={styles.clearButtonText}>✕</Text>
               </TouchableOpacity>
             )}
           </View>
           <TouchableOpacity
             style={styles.searchButton}
             onPress={searchWeather}
             disabled={loading}
           >
             {loading ? (
               <ActivityIndicator color="#00ffff" size="small" />
             ) : (
               <Text style={styles.searchButtonText}>Search</Text>
             )}
           </TouchableOpacity>
         </View>

        {weatherData && (
          <>
            {/* Current Weather */}
            <View style={styles.currentWeatherContainer}>
              <View style={styles.airQualityContainer}>
                <Text style={styles.airQualityIcon}>🌿</Text>
                <Text style={styles.airQualityText}>Good 13.5</Text>
              </View>
              
              <Text style={styles.precipitationText}>No precipitation for at least 120 min</Text>
              
                             <View style={styles.temperatureContainer}>
                 <Text style={styles.temperatureText}>
                   {Math.round(weatherData.current.temperature)}°C
                 </Text>
                 <Text style={styles.weatherIconLarge}>
                   {getWeatherIcon(weatherData.current.weather_code)}
                 </Text>
               </View>
              
              <Text style={styles.weatherCondition}>
                {weatherData.current.weather_descriptions[0]}
              </Text>
              
                             <View style={styles.tempRangeContainer}>
                 <Text style={styles.tempRangeText}>
                   ↑{Math.round(weatherData.current.temperature + 5)}° 
                   ↓{Math.round(weatherData.current.temperature - 5)}°
                 </Text>
               </View>
              
              <View style={styles.detailsContainer}>
                <Text style={styles.detailText}>
                  Humidity: {weatherData.current.humidity}%
                </Text>
                                 <Text style={styles.detailText}>
                   RealFeel®: {Math.round(weatherData.current.feelslike)}°
                 </Text>
              </View>
            </View>

            {/* Hourly Forecast */}
            <View style={styles.forecastSection}>
                             <View style={styles.sectionHeader}>
                 <View style={styles.sectionTitleContainer}>
                   <Text style={styles.sectionIcon}>🕐</Text>
                   <Text style={styles.sectionTitle}>HOURLY FORECAST</Text>
                 </View>
               </View>
              
                             <ScrollView 
                 horizontal 
                 showsHorizontalScrollIndicator={false}
                 contentContainerStyle={styles.hourlyScrollContainer}
               >
                 {(hourlyData.length > 0 ? hourlyData : fallbackHourlyData).map((hour, index) => (
                   <View key={index} style={styles.hourlyCard}>
                     <Text style={styles.hourlyTime}>{hour.time}</Text>
                     <Text style={styles.hourlyTemp}>{hour.temp}°C</Text>
                     <Text style={styles.hourlyIcon}>{hour.icon}</Text>
                     <Text style={styles.hourlyCondition}>{hour.condition}</Text>
                   </View>
                 ))}
               </ScrollView>
            </View>

            {/* Daily Forecast */}
            {forecastData && (
              <View style={styles.forecastSection}>
                                 <View style={styles.sectionHeader}>
                   <View style={styles.sectionTitleContainer}>
                     <Text style={styles.sectionIcon}>📅</Text>
                     <Text style={styles.sectionTitle}>DAILY FORECAST</Text>
                   </View>
                 </View>
                
                <Text style={styles.dailyDescription}>
                  Clouds and sun {formatDate(forecastData.forecast.forecastday[0]?.date || '')}
                </Text>
                
                <View style={styles.dailyContainer}>
                  {forecastData.forecast.forecastday.slice(0, 5).map((forecast, index) => (
                    <View key={index} style={styles.dailyCard}>
                      <View style={styles.dailyHeader}>
                        <Text style={styles.dailyDate}>
                          {index === 0 ? 'Today' : formatDate(forecast.date)}
                        </Text>
                        <Text style={styles.dailyCondition}>
                          {forecast.day.condition.text}
                        </Text>
                      </View>
                      
                      <View style={styles.dailyContent}>
                        <Text style={styles.dailyIcon}>
                          {getWeatherIcon(forecast.day.condition.code)}
                        </Text>
                        
                                                 <View style={styles.dailyTemps}>
                           <Text style={styles.dailyHigh}>
                             {Math.round(forecast.day.maxtemp_c)}°
                           </Text>
                           <Text style={styles.dailyLow}>
                             {Math.round(forecast.day.mintemp_c)}°
                           </Text>
                         </View>
                        
                        <View style={styles.tempBarContainer}>
                          <View style={styles.tempBar}>
                            <View 
                              style={[
                                styles.tempBarFill, 
                                { 
                                  width: `${((forecast.day.maxtemp_c - forecast.day.mintemp_c) / 20) * 100}%`,
                                  left: `${((forecast.day.mintemp_c + 10) / 30) * 100}%`
                                }
                              ]} 
                            />
                          </View>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </>
        )}

        {!weatherData && !loading && (
          <View style={styles.emptyState}>
            <View style={styles.emptyStateIcon}>
              <Text style={styles.weatherIconLarge}>🌤️</Text>
            </View>
            <Text style={styles.emptyStateTitle}>Welcome to Weather App</Text>
            <Text style={styles.emptyStateText}>Search for a location to see detailed weather information</Text>
            
            <View style={styles.featuresContainer}>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>🌡️</Text>
                <Text style={styles.featureText}>Current Weather</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>🕐</Text>
                <Text style={styles.featureText}>Hourly Forecast</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>📅</Text>
                <Text style={styles.featureText}>5-Day Forecast</Text>
              </View>
            </View>

            <View style={styles.quickSearchContainer}>
              <Text style={styles.quickSearchTitle}>Popular Cities</Text>
              <View style={styles.quickSearchButtons}>
                <TouchableOpacity 
                  style={styles.quickSearchButton}
                  onPress={() => {
                    setLocation('New York');
                    searchWeather();
                  }}
                >
                  <Text style={styles.quickSearchButtonText}>New York</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.quickSearchButton}
                  onPress={() => {
                    setLocation('London');
                    searchWeather();
                  }}
                >
                  <Text style={styles.quickSearchButtonText}>London</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.quickSearchButton}
                  onPress={() => {
                    setLocation('Tokyo');
                    searchWeather();
                  }}
                >
                  <Text style={styles.quickSearchButtonText}>Tokyo</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.quickSearchButton}
                  onPress={() => {
                    setLocation('Paris');
                    searchWeather();
                  }}
                >
                  <Text style={styles.quickSearchButtonText}>Paris</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.weatherInfoContainer}>
              <Text style={styles.weatherInfoTitle}>Weather Features</Text>
              <View style={styles.weatherInfoGrid}>
                <View style={styles.weatherInfoItem}>
                  <Text style={styles.weatherInfoIcon}>🌡️</Text>
                  <Text style={styles.weatherInfoText}>Temperature</Text>
                </View>
                <View style={styles.weatherInfoItem}>
                  <Text style={styles.weatherInfoIcon}>💨</Text>
                  <Text style={styles.weatherInfoText}>Wind Speed</Text>
                </View>
                <View style={styles.weatherInfoItem}>
                  <Text style={styles.weatherInfoIcon}>💧</Text>
                  <Text style={styles.weatherInfoText}>Humidity</Text>
                </View>
                <View style={styles.weatherInfoItem}>
                  <Text style={styles.weatherInfoIcon}>👁️</Text>
                  <Text style={styles.weatherInfoText}>Visibility</Text>
                </View>
                <View style={styles.weatherInfoItem}>
                  <Text style={styles.weatherInfoIcon}>🌫️</Text>
                  <Text style={styles.weatherInfoText}>Pressure</Text>
                </View>
                <View style={styles.weatherInfoItem}>
                  <Text style={styles.weatherInfoIcon}>☀️</Text>
                  <Text style={styles.weatherInfoText}>UV Index</Text>
                </View>
              </View>
            </View>
          </View>
        )}
              </ScrollView>
        
        {/* Chat Screen */}
        {showChat && (
          <ChatScreen onBack={() => setShowChat(false)} />
        )}
      </LinearGradient>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 255, 0.3)',
  },
  menuIcon: {
    fontSize: 20,
    color: '#00ffff',
  },
  locationContainer: {
    flex: 1,
    alignItems: 'center',
  },
  locationText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textShadowColor: '#00ffff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  dateTimeText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 4,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 255, 0.3)',
  },
  addIcon: {
    fontSize: 24,
    color: '#00ffff',
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 255, 0.3)',
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontSize: 16,
    color: '#ffffff',
  },
  clearButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  clearButtonText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 16,
    fontWeight: 'bold',
  },
  searchButton: {
    backgroundColor: 'rgba(0, 255, 255, 0.2)',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 255, 0.5)',
  },
  searchButtonText: {
    color: '#00ffff',
    fontSize: 16,
    fontWeight: '600',
  },
  currentWeatherContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 255, 0.2)',
    shadowColor: '#00ffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  airQualityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  airQualityIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  airQualityText: {
    fontSize: 14,
    color: '#00ff00',
    fontWeight: '600',
  },
  precipitationText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 20,
  },
  temperatureContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  temperatureText: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#ffffff',
    textShadowColor: '#00ffff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  weatherIconLarge: {
    fontSize: 60,
    marginLeft: 20,
  },
  weatherCondition: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 15,
    textTransform: 'capitalize',
  },
  tempRangeContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  tempRangeText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  detailText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  forecastSection: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    textShadowColor: '#00ffff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 5,
  },
  sectionLink: {
    fontSize: 14,
    color: '#00ffff',
    textDecorationLine: 'underline',
  },
  hourlyScrollContainer: {
    paddingHorizontal: 5,
  },
  hourlyCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 15,
    padding: 15,
    marginHorizontal: 5,
    alignItems: 'center',
    minWidth: 80,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 255, 0.2)',
  },
  hourlyTime: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 8,
  },
  hourlyTemp: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  hourlyIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  hourlyCondition: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
  },
  dailyDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 15,
  },
  dailyContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 255, 0.2)',
  },
  dailyCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  dailyHeader: {
    flex: 1,
  },
  dailyDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  dailyCondition: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  dailyContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 2,
  },
  dailyIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  dailyTemps: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  dailyHigh: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginRight: 8,
  },
  dailyLow: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  tempBarContainer: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  tempBar: {
    flex: 1,
    position: 'relative',
  },
  tempBarFill: {
    position: 'absolute',
    height: '100%',
    backgroundColor: '#00ffff',
    borderRadius: 3,
    opacity: 0.7,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyStateIcon: {
    marginBottom: 20,
  },
  emptyStateTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: '#00ffff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  emptyStateText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginBottom: 40,
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 40,
  },
  featureItem: {
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  quickSearchContainer: {
    width: '100%',
    marginBottom: 40,
  },
  quickSearchTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 15,
  },
  quickSearchButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  quickSearchButton: {
    backgroundColor: 'rgba(0, 255, 255, 0.2)',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 255, 0.3)',
  },
  quickSearchButtonText: {
    color: '#00ffff',
    fontSize: 14,
    fontWeight: '500',
  },
  weatherInfoContainer: {
    width: '100%',
  },
  weatherInfoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 15,
  },
  weatherInfoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  weatherInfoItem: {
    alignItems: 'center',
    width: '30%',
    marginBottom: 15,
  },
  weatherInfoIcon: {
    fontSize: 20,
    marginBottom: 5,
  },
  weatherInfoText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
});

export default WeatherScreen;
