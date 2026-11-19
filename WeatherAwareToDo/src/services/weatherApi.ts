
import type Weather from "../types/Weather";

function makeWeatherUrl(city: string): string {
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

  if (!apiKey) {
    throw new Error("Missing WeatherAPI key");
  }

  const endpoint =
    "https://api.weatherapi.com/v1/current.json";

  return (
    `${endpoint}?key=${encodeURIComponent(apiKey)}` +
    `&q=${encodeURIComponent(city)}`
  );
}

function mapWeather(data: any): Weather {
  return {
    city: data.location.name,
    temperature: data.current.temp_c,
    condition: data.current.condition.text,
    code: data.current.condition.code,
    icon: `https:${data.current.condition.icon}`,
    windSpeed: data.current.wind_kph,
    humidity: data.current.humidity,
    precipitation: data.current.precip_mm
  };
}

export async function getWeather(
  city: string
): Promise<Weather> {
  const response = await fetch(makeWeatherUrl(city));

  if (!response.ok) {
    throw new Error(`WeatherAPI HTTP ${response.status}`);
  }

  const data = await response.json();

  return mapWeather(data);
}
