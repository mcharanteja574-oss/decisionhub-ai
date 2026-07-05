const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export async function analyzeScenario(payload) {
  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Unable to analyze scenario.");
  }

  return response.json();
}

