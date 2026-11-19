
import type Weather from "../types/Weather";
import type { TaskCategory } from "../types/Todo";

import { getWeatherAlert } from "./getWeatherAlert";
import { getWeatherCategory } from "./weatherConditions";

export function getRecommendation(
  category: TaskCategory,
  weather: Weather | null
): string {
  if (category !== "outdoor") {
    return "No outdoor weather check needed.";
  }

  if (!weather) {
    return "Weather unavailable. Check local conditions before going outside.";
  }

  const severity = getWeatherAlert(weather);
  const type = getWeatherCategory(weather.code);
  const advice: string[] = [];

  if (type === "thunderstorm") {
    return "⛔ Thunderstorm risk. Postpone outdoor activities and seek shelter.";
  }

  if (weather.temperature <= 0) {
    advice.push(
      "🥶 Freezing weather. Wear warm clothing and suitable footwear."
    );
  } else if (weather.temperature <= 5) {
    advice.push(
      "🧥 Very cold. Wear a warm jacket."
    );
  } else if (weather.temperature >= 30) {
    advice.push(
      "🥵 High temperature. Avoid strenuous activity and stay hydrated."
    );
  }

  if (
    type === "rain" ||
    weather.precipitation > 0
  ) {
    advice.push(
      "☔ Take an umbrella or waterproof jacket."
    );
  }

  if (type === "snow" || type === "ice") {
    advice.push(
      "❄️ Watch for snow and slippery surfaces."
    );
  }

  if (type === "fog") {
    advice.push(
      "🌫️ Visibility may be reduced. Take extra care."
    );
  }

  if (type === "dust" || type === "smoke") {
    advice.push(
      "😷 Airborne particles may affect breathing. Consider staying indoors."
    );
  }

  if (weather.windSpeed >= 40) {
    advice.push(
      "💨 Strong wind. Postpone exposed outdoor activities."
    );
  } else if (weather.windSpeed >= 25) {
    advice.push(
      "🌬️ Windy conditions. Secure loose items."
    );
  }

  if (severity === "danger") {
    advice.unshift(
      "⛔ Potentially unsuitable outdoor conditions."
    );
  }

  if (severity === "unknown") {
    advice.push(
      "⚠️ Weather classification uncertain. Check a local forecast."
    );
  }

  if (advice.length === 0) {
    return "✅ Conditions appear generally suitable for outdoor activities.";
  }

  return advice.join(" ");
}
