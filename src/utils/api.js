export const generateGeminiText = async (userPrompt, systemPrompt) => {
  const apiKey = ""; // 填入你的API Key
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
const payload = {
  contents: [{ parts: [{ text: userPrompt }] }],
systemInstruction: { parts: [{ text: systemPrompt }] },
};

let retries = 3;
let delay = 1000;
while (retries > 0) {
  try {
  const response = await fetch(apiUrl, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
});
if (!response.ok) throw new Error("API Error");
const result = await response.json();
return result.candidates?.[0]?.content?.parts?.[0]?.text || "No output generated.";
} catch (error) {
  retries--;
  if (retries === 0) throw error;
  await new Promise(resolve => setTimeout(resolve, delay));
  delay *= 2;
}
}
};