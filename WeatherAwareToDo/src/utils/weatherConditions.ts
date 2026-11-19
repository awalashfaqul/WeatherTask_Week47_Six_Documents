
import conditions from "../data/weather_conditions.json";

export type WeatherCategory =
  | "clear"
  | "cloudy"
  | "rain"
  | "snow"
  | "ice"
  | "fog"
  | "thunderstorm"
  | "dust"
  | "smoke"
  | "other";

export type ConditionIntensity =
  | "normal"
  | "light"
  | "moderate"
  | "heavy"
  | "severe";

type WeatherCondition = {
  code: number;
  day: string;
  night: string;
  icon: number;
};

const conditionMap = new Map<number, WeatherCondition>(
  (conditions as WeatherCondition[]).map(
    (condition) => [condition.code, condition]
  )
);

export function getWeatherCondition(
  code: number
): WeatherCondition | undefined {
  return conditionMap.get(code);
}

export function isKnownWeatherCode(
  code: number
): boolean {
  return conditionMap.has(code);
}

export function getWeatherCategory(
  code: number
): WeatherCategory {
  const condition = getWeatherCondition(code);

  if (!condition) return "other";

  const text = condition.day.toLowerCase();

  if (text.includes("thunder")) {
    return "thunderstorm";
  }

  if (
    text.includes("freezing") ||
    text.includes("ice") ||
    text.includes("sleet")
  ) {
    return "ice";
  }

  if (
    text.includes("snow") ||
    text.includes("blizzard")
  ) {
    return "snow";
  }

  if (
    text.includes("rain") ||
    text.includes("drizzle")
  ) {
    return "rain";
  }

  if (
    text.includes("fog") ||
    text.includes("mist") ||
    text.includes("haze")
  ) {
    return "fog";
  }

  if (
    text.includes("smoke") ||
    text.includes("smog")
  ) {
    return "smoke";
  }

  if (
    text.includes("dust") ||
    text.includes("sandstorm")
  ) {
    return "dust";
  }

  if (
    text.includes("cloud") ||
    text.includes("overcast")
  ) {
    return "cloudy";
  }

  if (
    text.includes("sunny") ||
    text.includes("clear")
  ) {
    return "clear";
  }

  return "other";
}

export function getConditionIntensity(
  code: number
): ConditionIntensity {
  const condition = getWeatherCondition(code);

  if (!condition) return "normal";

  const text = condition.day.toLowerCase();

  if (
    text.includes("severe") ||
    text.includes("torrential") ||
    text.includes("blizzard")
  ) {
    return "severe";
  }

  if (text.includes("heavy")) {
    return "heavy";
  }

  if (text.includes("moderate")) {
    return "moderate";
  }

  if (text.includes("light")) {
    return "light";
  }

  return "normal";
}
