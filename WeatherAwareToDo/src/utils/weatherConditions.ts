
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

type ConditionEntry = {
  code: number;
  day: string;
  night: string;
};

const conditionMap = new Map<number, ConditionEntry>(
  (conditions as ConditionEntry[]).map(
    (item) => [item.code, item]
  )
);

export function getWeatherCategory(
  code: number
): WeatherCategory {
  const entry = conditionMap.get(code);

  if (!entry) return "other";

  const description =
    `${entry.day} ${entry.night}`.toLowerCase();

  if (/thunder/.test(description)) {
    return "thunderstorm";
  }

  if (/freezing|ice|icy/.test(description)) {
    return "ice";
  }

  if (/snow|blizzard/.test(description)) {
    return "snow";
  }

  if (/sleet/.test(description)) {
    return "ice";
  }

  if (/rain|drizzle|shower/.test(description)) {
    return "rain";
  }

  if (/fog|mist|haze/.test(description)) {
    return "fog";
  }

  if (/smoke|pollution|volcanic ash/.test(description)) {
    return "smoke";
  }

  if (/dust|sand/.test(description)) {
    return "dust";
  }

  if (/cloud|overcast/.test(description)) {
    return "cloudy";
  }

  if (/sunny|clear/.test(description)) {
    return "clear";
  }

  return "other";
}

export function isKnownWeatherCode(
  code: number
): boolean {
  return conditionMap.has(code);
}
