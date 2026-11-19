
import type Weather from "../types/Weather";
import { getWeatherAlert } from "../utils/getWeatherAlert";
import { getRecommendation } from "../utils/getRecommendation";

type Props = {
  weather: Weather;
  isSample?: boolean;
};

export default function WeatherDashboard({
  weather,
  isSample = false
}: Props) {
  const severity = getWeatherAlert(weather);

  return (
    <section className={`weather-card ${severity}`}>
      {severity === "danger" && (
        <span
          className="weather-alert-icon"
          role="img"
          aria-label="Severe weather warning"
          title="Potentially unsuitable outdoor conditions"
        >
          🚨
        </span>
      )}

      {severity === "caution" && (
        <span
          className="weather-alert-icon"
          role="img"
          aria-label="Weather caution"
        >
          ⚠️
        </span>
      )}

      <h2>Weather in {weather.city}</h2>

      {isSample && <p>Sample weather data</p>}

      {weather.icon && (
        <img
          src={weather.icon}
          alt={weather.condition}
        />
      )}

      <p className="weather-temperature">
        {weather.temperature}°C
      </p>

      <p>{weather.condition}</p>
      <p>Wind: {weather.windSpeed} km/h</p>
      <p>Humidity: {weather.humidity}%</p>
      <p>
        Precipitation: {weather.precipitation} mm
      </p>

      <p className={`weather-status ${severity}`}>
        {getRecommendation("outdoor", weather)}
      </p>
    </section>
  );
}
