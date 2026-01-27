import axios from "axios";
 
const FEATURE_LABELS = [
  "Dog",
  "Cat",
  "Mammal",
  "Pet",
  "Animal",
  "Canidae",
  "Feline",
  "Puppy",
  "Kitten",
  "Street",
  "Collar",
  "Leash",
  "Brown",
  "Black",
  "White",
  "Gray",
];
 
function buildVector(scores: Record<string, number>) {
  return FEATURE_LABELS.map((l) => scores[l] ?? 0);
}
 
export async function getImageEmbedding(imageUrl: string): Promise<number[]> {
  const apiKey = process.env.GOOGLE_API_KEY;
 
  const res = await axios.post(
    `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
    {
      requests: [
        {
          image: {
            source: { imageUri: imageUrl },
          },
          features: [
            { type: "LABEL_DETECTION", maxResults: 20 },
            { type: "OBJECT_LOCALIZATION", maxResults: 20 },
          ],
        },
      ],
    },
  );
 
  const result = res.data.responses[0];
 
  const scores: Record<string, number> = {};
 
  for (const l of result.labelAnnotations || []) {
    scores[l.description] = Math.max(scores[l.description] ?? 0, l.score ?? 0);
  }
 
  for (const o of result.localizedObjectAnnotations || []) {
    scores[o.name] = Math.max(scores[o.name] ?? 0, (o.score ?? 0) * 1.1);
  }
 
  return buildVector(scores);
}
 
 