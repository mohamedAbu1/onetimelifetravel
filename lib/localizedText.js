export function localizedText(value, language = "en") {
  if (value === null || value === undefined) return "";

  if (typeof value === "string") {
    const text = value.trim();
    if ((text.startsWith("{") && text.endsWith("}")) || (text.startsWith("[") && text.endsWith("]"))) {
      try {
        const parsed = JSON.parse(text);
        if (parsed !== value) return localizedText(parsed, language);
      } catch {
        // Keep valid plain text unchanged when it is not JSON.
      }
    }
    return value;
  }

  if (Array.isArray(value)) return localizedText(value[0], language);

  if (typeof value === "object") {
    const normalizedLanguage = language?.split("-")[0] || "en";
    const selected = value[normalizedLanguage] ?? value[language] ?? value.en ?? Object.values(value)[0];
    return selected && selected !== value ? localizedText(selected, normalizedLanguage) : "";
  }

  return String(value);
}
