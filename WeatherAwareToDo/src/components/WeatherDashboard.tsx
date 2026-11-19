
import type Weather from "../types/Weather";

type Props = {
  weather: Weather;
  isSample?: boolean;
};

export default function WeatherDashboard({
  weather,
  isSample = false
}: Props) {
  return (
    <section>
      <h2>Weather in {weather.city}</h2>

      {isSample && <p>Sample weather data</p>}

      {weather.icon && (
        <img
          src={weather.icon}
          alt={weather.condition}
        />
      )}

      <p>Temperature: {weather.temperature} °C</p>
      <p>Condition: {weather.condition}</p>
      <p>Condition code: {weather.code}</p>
      <p>Wind: {weather.windSpeed} km/h</p>
      <p>Humidity: {weather.humidity} %</p>
      <p>Precipitation: {weather.precipitation} mm</p>
    </section>
  );
}
