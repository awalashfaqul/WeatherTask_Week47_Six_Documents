
import type Weather from "../types/Weather";

import {
  getWeatherCategory,
  getConditionIntensity,
  isKnownWeatherCode
} from "./weatherConditions";

export type WeatherSeverity =
  | "safe"
  | "caution"
  | "danger"
  | "unknown";

export function getWeatherAlert(
  weather: Weather | null
): WeatherSeverity {
  if (!weather) return "unknown";

  const category = getWeatherCategory(weather.code);
  const intensity = getConditionIntensity(weather.code);

  // Dangerous weather
  if (
    category === "thunderstorm" ||
    intensity === "severe" ||
    (
      intensity === "heavy" &&
      ["rain", "snow", "ice"].includes(category)
    ) ||
    weather.windSpeed >= 40 ||
    weather.precipitation >= 10
  ) {
    return "danger";
  }

  // Weather requiring caution
  if (
    weather.temperature <= 0 ||
    weather.temperature >= 30 ||
    weather.windSpeed >= 25 ||
    weather.precipitation > 0 ||
    [
      "rain",
      "snow",
      "ice",
      "fog",
      "dust",
      "smoke"
    ].includes(category)
  ) {
    return "caution";
  }

  if (!isKnownWeatherCode(weather.code)) {
    return "unknown";
  }

  if (category === "other") {
    return "unknown";
  }

  return "safe";
}
