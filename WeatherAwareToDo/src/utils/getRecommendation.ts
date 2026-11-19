
import type Weather from "../types/Weather";
import type { TaskCategory } from "../types/Todo";

export function getRecommendation(
  category: TaskCategory,
  weather: Weather | null
): string {
  if (category !== "outdoor") {
    return "No outdoor weather check needed.";
  }

  if (!weather) {
    return "Weather information unavailable. Check the forecast before going outside.";
  }

  const {
    temperature,
    condition,
    code,
    windSpeed,
    precipitation
  } = weather;

  const advice: string[] = [];
  const conditionText = condition.toLowerCase();

  // 1. Dangerous weather conditions
  if (
    [1087, 1273, 1276, 1279, 1282].includes(code) ||
    conditionText.includes("thunder")
  ) {
    return "⛔ Thunderstorm conditions: postpone outdoor activities and seek shelter.";
  }

  // 2. Temperature
  if (temperature <= 0) {
    advice.push(
      "🥶 Freezing conditions. Wear warm clothing, gloves and suitable footwear. Consider postponing prolonged outdoor tasks."
    );
  } else if (temperature <= 5) {
    advice.push(
      "🧥 Very cold outside. Wear a warm jacket."
    );
  } else if (temperature >= 30) {
    advice.push(
      "🥵 Very hot outside. Drink water and avoid strenuous activities."
    );
  } else if (temperature >= 25) {
    advice.push(
      "☀️ Warm weather. Stay hydrated and take breaks."
    );
  }

  // 3. Precipitation
  if (
    precipitation > 0 ||
    conditionText.includes("rain") ||
    conditionText.includes("drizzle")
  ) {
    advice.push(
      "☔ Rain detected. Take an umbrella or waterproof jacket."
    );
  }

  // 4. Snow and ice
  if (
    conditionText.includes("snow") ||
    conditionText.includes("sleet") ||
    conditionText.includes("ice")
  ) {
    advice.push(
      "❄️ Snow or ice conditions. Wear suitable footwear and be careful on slippery surfaces."
    );
  }

  // 5. Wind
  if (windSpeed >= 40) {
    advice.push(
      "💨 Strong wind. Consider postponing exposed outdoor activities."
    );
  } else if (windSpeed >= 25) {
    advice.push(
      "🌬️ Windy conditions. Secure loose items and dress appropriately."
    );
  }

  // 6. Good weather
  if (advice.length === 0) {
    return "✅ Weather conditions appear generally suitable for outdoor activities.";
  }

  return advice.join(" ");
}
