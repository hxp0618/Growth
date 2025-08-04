import * as Location from 'expo-location';

export interface WeatherData {
  temperature: number;
  condition: string;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
  city: string;
  feelsLike: number;
  uvIndex?: number;
  visibility?: number;
}

export interface WeatherAdvice {
  clothing: string;
  umbrella: boolean;
  typhoonWarning: boolean;
  healthTips: string[];
  icon: string;
}

class WeatherService {
  private readonly API_KEY = 'demo'; // 使用免费的OpenWeatherMap API
  private readonly BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

  async getCurrentLocation(): Promise<Location.LocationObject | null> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('位置权限被拒绝');
        return null;
      }

      const location = await Location.getCurrentPositionAsync({});
      return location;
    } catch (error) {
      console.error('获取位置失败:', error);
      return null;
    }
  }

  async getWeatherData(lat?: number, lon?: number): Promise<WeatherData | null> {
    try {
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 如果没有提供坐标，尝试获取当前位置
      if (!lat || !lon) {
        // 使用默认位置（上海）
        lat = 31.2304;
        lon = 121.4737;
      }

      // 由于这是演示，我们使用模拟数据
      // 在实际应用中，你需要注册OpenWeatherMap API并使用真实的API密钥
      const condition = this.getRandomCondition();
      const temperature = Math.floor(Math.random() * 15) + 20; // 20-35度
      
      const mockWeatherData: WeatherData = {
        temperature,
        condition,
        description: this.getWeatherDescription(condition),
        humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
        windSpeed: Math.floor(Math.random() * 10) + 5, // 5-15 km/h
        icon: this.getWeatherIcon(condition),
        city: '上海',
        feelsLike: temperature + Math.floor(Math.random() * 6) - 3, // 体感温度差异
        uvIndex: Math.floor(Math.random() * 8) + 1,
        visibility: Math.floor(Math.random() * 5) + 5
      };

      return mockWeatherData;

      // 真实API调用代码（需要有效的API密钥）
      /*
      const url = `${this.BASE_URL}?lat=${lat}&lon=${lon}&appid=${this.API_KEY}&units=metric&lang=zh_cn`;
      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        return {
          temperature: Math.round(data.main.temp),
          condition: data.weather[0].main,
          description: data.weather[0].description,
          humidity: data.main.humidity,
          windSpeed: Math.round(data.wind.speed * 3.6), // m/s to km/h
          icon: this.getWeatherIcon(data.weather[0].main),
          city: data.name,
          feelsLike: Math.round(data.main.feels_like),
          uvIndex: data.uvi,
          visibility: data.visibility ? Math.round(data.visibility / 1000) : undefined
        };
      }
      */
    } catch (error) {
      console.error('获取天气数据失败:', error);
      return null;
    }
  }

  private getRandomCondition(): string {
    const conditions = ['Clear', 'Clouds', 'Rain', 'Drizzle', 'Thunderstorm', 'Snow', 'Mist'];
    return conditions[Math.floor(Math.random() * conditions.length)];
  }

  private getWeatherIcon(condition: string): string {
    const iconMap: { [key: string]: string } = {
      'Clear': '☀️',
      'Clouds': '☁️',
      'Rain': '🌧️',
      'Drizzle': '🌦️',
      'Thunderstorm': '⛈️',
      'Snow': '❄️',
      'Mist': '🌫️',
      'Fog': '🌫️',
      'Haze': '🌫️'
    };
    return iconMap[condition] || '🌤️';
  }

  private getWeatherDescription(condition: string): string {
    const descriptionMap: { [key: string]: string } = {
      'Clear': '晴朗',
      'Clouds': '多云',
      'Rain': '雨天',
      'Drizzle': '小雨',
      'Thunderstorm': '雷阵雨',
      'Snow': '雪天',
      'Mist': '薄雾',
      'Fog': '雾天',
      'Haze': '霾天'
    };
    return descriptionMap[condition] || '多云转晴';
  }

  getWeatherAdvice(weather: WeatherData): WeatherAdvice {
    const advice: WeatherAdvice = {
      clothing: '',
      umbrella: false,
      typhoonWarning: false,
      healthTips: [],
      icon: '👗'
    };

    // 穿衣建议
    if (weather.temperature < 10) {
      advice.clothing = '建议穿厚外套、毛衣，注意保暖';
      advice.icon = '🧥';
    } else if (weather.temperature < 20) {
      advice.clothing = '建议穿薄外套或长袖，适中温度';
      advice.icon = '👔';
    } else if (weather.temperature < 28) {
      advice.clothing = '建议穿轻薄长袖或短袖，舒适温度';
      advice.icon = '👕';
    } else {
      advice.clothing = '建议穿轻薄透气衣物，注意防晒';
      advice.icon = '👗';
    }

    // 带伞建议
    if (weather.condition === 'Rain' || weather.condition === 'Drizzle' || weather.condition === 'Thunderstorm') {
      advice.umbrella = true;
      advice.healthTips.push('今天有雨，记得带伞出门');
    }

    // 台风预警（基于风速和天气条件）
    if (weather.windSpeed > 30 && weather.condition === 'Thunderstorm') {
      advice.typhoonWarning = true;
      advice.healthTips.push('⚠️ 强风暴雨天气，建议减少外出');
    }

    // 健康提示
    if (weather.temperature > 30) {
      advice.healthTips.push('高温天气，多喝水，避免长时间户外活动');
    }

    if (weather.humidity > 80) {
      advice.healthTips.push('湿度较高，注意通风，预防霉菌');
    }

    if (weather.uvIndex && weather.uvIndex > 6) {
      advice.healthTips.push('紫外线较强，外出请做好防晒');
    }

    // 孕期特殊建议
    if (weather.temperature > 28) {
      advice.healthTips.push('🤱 孕期注意防暑降温，避免过热');
    }

    if (weather.condition === 'Thunderstorm') {
      advice.healthTips.push('🤱 雷雨天气，孕妇应避免外出');
    }

    return advice;
  }
}

export const weatherService = new WeatherService();