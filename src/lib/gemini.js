import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const generateCoffeeStory = async (coffee) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `Kamu adalah AI Barista ahli kopi Indonesia. Analisis kopi berikut dan berikan respons dalam format JSON yang valid (tanpa markdown code block):

Data Kopi:
- Nama: ${coffee.name}
- Asal: ${coffee.origin}
- Level Roasting: ${coffee.roastLevel}
- Harga: Rp ${coffee.price}
- Deskripsi: ${coffee.description}

Berikan respons JSON dengan struktur berikut:
{
  "story": "Cerita menarik tentang kopi ini dalam 2-3 kalimat, gaya bahasa Gen Z Indonesia",
  "flavor_profile": "Profil rasa dalam 1 kalimat",
  "acidity_level": "Rendah/Sedang/Tinggi",
  "health_safety": {
    "is_safe_for_gerd": true/false,
    "warning": "Peringatan kesehatan jika ada",
    "age_recommendation": "Rekomendasi usia",
    "conditions_to_avoid": ["kondisi1", "kondisi2"]
  },
  "pairing_food": "Rekomendasi makanan pendamping",
  "fun_fact": "Fakta unik tentang kopi ini"
}

PENTING: Respons HANYA JSON valid, tanpa teks tambahan atau markdown.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Gagal menganalisis kopi. Coba lagi nanti.');
  }
};

export const generateCoffeeRecommendations = async (currentCoffee, allCoffees) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const coffeeList = allCoffees
    .filter(c => c.id !== currentCoffee.id)
    .slice(0, 10)
    .map(c => `- ${c.name} (${c.origin}, ${c.roastLevel})`)
    .join('\n');

  const prompt = `Berdasarkan kopi "${currentCoffee.name}" dari ${currentCoffee.origin} dengan roast level ${currentCoffee.roastLevel}, rekomendasikan 3 kopi serupa dari daftar berikut:

${coffeeList}

Respons dalam format JSON array nama kopi saja, contoh: ["Kopi A", "Kopi B", "Kopi C"]
PENTING: Respons HANYA JSON valid.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error('Recommendation Error:', error);
    return [];
  }
};
