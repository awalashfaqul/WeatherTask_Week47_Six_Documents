
export type TaskLanguage =
  | "original"
  | "en"
  | "sv";

export async function translateTask(
  text: string,
  target: "en" | "sv"
): Promise<string> {
  const response = await fetch("/api/translate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      text,
      target
    })
  });

  if (!response.ok) {
    throw new Error(
      `Translation failed: ${response.status}`
    );
  }

  const data = (await response.json()) as {
    translatedText: string;
  };

  return data.translatedText;
}
