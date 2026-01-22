import vision from "@google-cloud/vision";
console.log("Using key:", process.env.GOOGLE_API_KEY?.slice(0, 6));
const client = new vision.ImageAnnotatorClient({
  apiKey: process.env.GOOGLE_API_KEY,
});

export async function analyzeImage(imageUrl: string) {
  const [result] = await client.annotateImage({
    image: { source: { imageUri: imageUrl } },
    features: [
      { type: "LABEL_DETECTION", maxResults: 10 },
      { type: "OBJECT_LOCALIZATION", maxResults: 10 },
    ],
  });

  return {
    labels: result.labelAnnotations,
    objects: result.localizedObjectAnnotations,
  };
}
