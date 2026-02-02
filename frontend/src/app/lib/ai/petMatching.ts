"use client";

// Advanced AI Pet Matching Service with Enhanced Image & Description Analysis
// Dogs match only with Dogs, Cats match only with Cats

export interface PetForMatching {
  _id: string;
  name: string;
  petType: string; // "Dog" or "Cat"
  breed: string;
  image: string;
  location: string;
  role: "Lost" | "Found";
  createdAt: string;
  description: string;
  lat?: number;
  lng?: number;
  gender?: string;
  color?: string;
}

export interface MatchReason {
  type: "image" | "breed" | "location" | "time" | "type" | "description";
  score: number;
  messageKey: string;
  details?: string;
}

export interface MatchResult {
  matchId: string;
  matchName?: string;
  confidenceScore: number;
  reasons: MatchReason[];
  distance: number;
  timeDiff: number;
  imageMatch: number;
  breedMatch: number;
  descriptionMatch: number;
  locationMatch: number;
  petType: string;
  matchImage?: string;
}

export interface PossibleMatch {
  pet: PetForMatching;
  matches: MatchResult[];
}

// Reason translations
const reasonTranslations = {
  mn: {
    "image.excellent": "Зураг маш төстэй (95%+)",
    "image.very_good": "Зураг сайн төстэй (80-95%)",
    "image.good": "Зураг төстэй (60-80%)",
    "image.moderate": "Зураг төстэй байж болохуйц (40-60%)",
    "image.low": "Зураг бага төстэй (<40%)",

    "breed.exact": "Яг адилхан үүлдэр (100%)",
    "breed.very_similar": "Маш төстэй үүлдэр (80%+)",
    "breed.similar": "Төстэй үүлдэр (60%+)",
    "breed.low": "Бага төстэй үүлдэр",

    "location.very_close": "Маш ойрын байршил (<1км)",
    "location.close": "Ойрын байршил (1-3км)",
    "location.moderate": "Дундаж байршил (3-10км)",
    "location.far": "Холын байршил (10км+)",

    "time.same_day": "Нэг өдрийн дотор",
    "time.two_days": "2-3 өдрийн зөрүү",
    "time.few_days": "4-7 өдрийн зөрүү",
    "time.moderate": "1-2 долоо хоног",
    "time.old": "2 долоо хоног+",

    "type.dog": "Нохойтой нохойн адилхан",
    "type.cat": "Муурттай муурны адилхан",

    "description.perfect": "Тайлбар яг адилхан",
    "description.excellent": "Тайлбар маш төстэй",
    "description.good": "Тайлбар төстэй",
    "description.moderate": "Тайлбар бага төстэй",
  },
  en: {
    "image.excellent": "Images very similar (95%+)",
    "image.very_good": "Images match well (80-95%)",
    "image.good": "Images similar (60-80%)",
    "image.moderate": "Images somewhat match (40-60%)",
    "image.low": "Images barely match (<40%)",

    "breed.exact": "Exact breed match (100%)",
    "breed.very_similar": "Very similar breed (80%+)",
    "breed.similar": "Similar breed (60%+)",
    "breed.low": "Low breed similarity",

    "location.very_close": "Very close location (<1km)",
    "location.close": "Close location (1-3km)",
    "location.moderate": "Moderate distance (3-10km)",
    "location.far": "Far location (10km+)",

    "time.same_day": "Same day report",
    "time.two_days": "2-3 days apart",
    "time.few_days": "4-7 days apart",
    "time.moderate": "1-2 weeks apart",
    "time.old": "2+ weeks apart",

    "type.dog": "Dog matches with dog",
    "type.cat": "Cat matches with cat",

    "description.perfect": "Description exact match",
    "description.excellent": "Description very similar",
    "description.good": "Description similar",
    "description.moderate": "Description somewhat similar",
  },
};

export const getReasonMessage = (
  language: "mn" | "en",
  messageKey: string,
): string => {
  return (
    reasonTranslations[language][
      messageKey as keyof (typeof reasonTranslations)["mn"]
    ] || messageKey
  );
};

// ✅ ADVANCED: Extract specific color features
const extractColorFeatures = (
  imageData: Uint8ClampedArray,
): {
  dominantColor: [number, number, number];
  colorVariance: number;
  brightness: number;
} => {
  let r = 0,
    g = 0,
    b = 0;
  let brightness = 0;
  const pixelCount = imageData.length / 4;

  // Calculate average color and brightness
  for (let i = 0; i < imageData.length; i += 4) {
    r += imageData[i];
    g += imageData[i + 1];
    b += imageData[i + 2];

    // Luminance calculation
    const lum =
      0.299 * imageData[i] +
      0.587 * imageData[i + 1] +
      0.114 * imageData[i + 2];
    brightness += lum;
  }

  r = Math.round(r / pixelCount);
  g = Math.round(g / pixelCount);
  b = Math.round(b / pixelCount);
  brightness = brightness / pixelCount / 255;

  // Calculate color variance
  let variance = 0;
  for (let i = 0; i < imageData.length; i += 4) {
    variance += Math.pow(imageData[i] - r, 2);
    variance += Math.pow(imageData[i + 1] - g, 2);
    variance += Math.pow(imageData[i + 2] - b, 2);
  }
  variance = Math.sqrt(variance / pixelCount / 3);

  return {
    dominantColor: [r, g, b],
    colorVariance: variance,
    brightness: brightness,
  };
};

// ✅ ADVANCED: Calculate histogram-based image similarity
const calculateHistogramSimilarity = (
  features1: Uint8ClampedArray,
  features2: Uint8ClampedArray,
): number => {
  // Create histograms (256 bins for each channel)
  const hist1 = new Uint32Array(768); // 256 * 3 channels
  const hist2 = new Uint32Array(768);

  for (let i = 0; i < features1.length; i += 4) {
    hist1[features1[i]]++;
    hist1[256 + features1[i + 1]]++;
    hist1[512 + features1[i + 2]]++;

    hist2[features2[i]]++;
    hist2[256 + features2[i + 1]]++;
    hist2[512 + features2[i + 2]]++;
  }

  // Normalize histograms
  const norm1 = new Float32Array(768);
  const norm2 = new Float32Array(768);

  for (let i = 0; i < 768; i++) {
    norm1[i] = hist1[i] / (features1.length / 4);
    norm2[i] = hist2[i] / (features2.length / 4);
  }

  // Calculate Chi-squared distance
  let chiSquared = 0;
  for (let i = 0; i < 768; i++) {
    const sum = norm1[i] + norm2[i];
    if (sum > 0) {
      const diff = norm1[i] - norm2[i];
      chiSquared += (diff * diff) / sum;
    }
  }

  // Convert to similarity score (0-100)
  const similarity = Math.max(0, 100 - chiSquared * 5);
  return similarity;
};

// ✅ ADVANCED: Detect shapes/patterns in image
const detectPatterns = (
  imageData: Uint8ClampedArray,
): {
  hasPatterns: boolean;
  patternIntensity: number;
  edges: number;
} => {
  const width = Math.sqrt(imageData.length / 4);
  let edgeCount = 0;
  let transitionCount = 0;

  // Edge detection using Sobel operator
  for (let y = 1; y < width - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;

      // Simple edge detection
      const center = imageData[idx];
      const neighbors = [
        imageData[(y - 1) * width * 4 + x * 4],
        imageData[(y + 1) * width * 4 + x * 4],
        imageData[y * width * 4 + (x - 1) * 4],
        imageData[y * width * 4 + (x + 1) * 4],
      ];

      const avgNeighbor = neighbors.reduce((a, b) => a + b, 0) / 4;
      const diff = Math.abs(center - avgNeighbor);

      if (diff > 30) {
        edgeCount++;
      }
      if (diff > 10) {
        transitionCount++;
      }
    }
  }

  const totalPixels = (width - 2) * (width - 2);
  const edgePercentage = (edgeCount / totalPixels) * 100;
  const patternIntensity = (transitionCount / totalPixels) * 100;

  return {
    hasPatterns: edgePercentage > 10,
    patternIntensity: Math.min(100, patternIntensity),
    edges: edgeCount,
  };
};

// ✅ ADVANCED: Compare images comprehensively
const calculateAdvancedImageSimilarity = async (
  image1Url: string,
  image2Url: string,
): Promise<number> => {
  try {
    const features1 = await extractImageFeatures(image1Url);
    const features2 = await extractImageFeatures(image2Url);

    if (!features1 || !features2) {
      return 50; // Default moderate match
    }

    // Method 1: Histogram comparison (40% weight)
    const histogramScore = calculateHistogramSimilarity(features1, features2);

    // Method 2: Color feature comparison (30% weight)
    const color1 = extractColorFeatures(features1);
    const color2 = extractColorFeatures(features2);

    const colorDiff = Math.sqrt(
      Math.pow(color1.dominantColor[0] - color2.dominantColor[0], 2) +
        Math.pow(color1.dominantColor[1] - color2.dominantColor[1], 2) +
        Math.pow(color1.dominantColor[2] - color2.dominantColor[2], 2),
    );
    const colorScore = Math.max(0, 100 - (colorDiff / 255) * 100);

    // Method 3: Pattern/structure comparison (20% weight)
    const patterns1 = detectPatterns(features1);
    const patterns2 = detectPatterns(features2);

    const patternScore =
      100 - Math.abs(patterns1.patternIntensity - patterns2.patternIntensity);

    // Method 4: Brightness comparison (10% weight)
    const brightnessDiff = Math.abs(color1.brightness - color2.brightness);
    const brightnessScore = Math.max(0, 100 - brightnessDiff * 100);

    // Weighted average
    const finalScore =
      histogramScore * 0.4 +
      colorScore * 0.3 +
      patternScore * 0.2 +
      brightnessScore * 0.1;

    return Math.round(Math.max(20, Math.min(100, finalScore)));
  } catch (err) {
    console.log("Error in image similarity:", err);
    return 50;
  }
};

const extractImageFeatures = async (
  imageUrl: string,
): Promise<Uint8ClampedArray | null> => {
  return new Promise((resolve) => {
    try {
      const img = new Image();
      img.crossOrigin = "anonymous";

      const timeout = setTimeout(() => resolve(null), 5000);

      img.onload = () => {
        clearTimeout(timeout);
        try {
          const canvas = document.createElement("canvas");
          canvas.width = 64;
          canvas.height = 64;
          const ctx = canvas.getContext("2d");

          if (ctx) {
            ctx.drawImage(img, 0, 0, 64, 64);
            const imageData = ctx.getImageData(0, 0, 64, 64);
            resolve(imageData.data);
          } else {
            resolve(null);
          }
        } catch (err) {
          resolve(null);
        }
      };

      img.onerror = () => {
        clearTimeout(timeout);
        resolve(null);
      };

      img.src = imageUrl;
    } catch (err) {
      resolve(null);
    }
  });
};

// ✅ ADVANCED: Better keyword extraction with semantic analysis
const extractSemanticKeywords = (
  text: string,
): { keywords: string[]; concepts: string[] } => {
  if (!text) return { keywords: [], concepts: [] };

  const words = text
    .toLowerCase()
    .trim()
    .split(/[\s,\.;!?:'"—–()\[\]{}]+/);

  const stopWords = new Set([
    "a",
    "an",
    "and",
    "are",
    "as",
    "at",
    "be",
    "by",
    "for",
    "from",
    "have",
    "he",
    "in",
    "is",
    "it",
    "of",
    "on",
    "or",
    "that",
    "the",
    "to",
    "was",
    "will",
    "with",
    "bn",
    "bna",
    "bsn",
    "gesen",
    "gedeg",
    "bui",
    "boloh",
    "bolno",
    "ye",
    "eh",
  ]);

  const keywords = words
    .filter((w) => w.length > 2 && !stopWords.has(w) && !/^\d+$/.test(w))
    .slice(0, 10);

  // Extract semantic concepts (color, size, characteristics)
  const concepts: string[] = [];
  const colorKeywords = [
    "red",
    "black",
    "white",
    "brown",
    "yellow",
    "gray",
    "golden",
    "ulaan",
    "har",
    "tsagaan",
  ];
  const sizeKeywords = [
    "big",
    "small",
    "large",
    "tiny",
    "huge",
    "tom",
    "jijig",
  ];
  const characteristicKeywords = [
    "fluffy",
    "long-hair",
    "short-hair",
    "spotted",
    "striped",
  ];

  [...colorKeywords, ...sizeKeywords, ...characteristicKeywords].forEach(
    (keyword) => {
      if (text.toLowerCase().includes(keyword)) {
        concepts.push(keyword);
      }
    },
  );

  return { keywords, concepts };
};

// ✅ ADVANCED: Calculate semantic description similarity
const calculateSemanticSimilarity = (
  desc1: string,
  desc2: string,
): { score: number; matchedConcepts: string[] } => {
  const data1 = extractSemanticKeywords(desc1);
  const data2 = extractSemanticKeywords(desc2);

  const keywords1 = new Set(data1.keywords);
  const keywords2 = new Set(data2.keywords);
  const concepts1 = new Set(data1.concepts);
  const concepts2 = new Set(data2.concepts);

  let keywordMatches = 0;
  for (const kw of keywords1) {
    if (keywords2.has(kw)) keywordMatches++;
  }

  let conceptMatches = 0;
  const matchedConcepts: string[] = [];
  for (const concept of concepts1) {
    if (concepts2.has(concept)) {
      conceptMatches++;
      matchedConcepts.push(concept);
    }
  }

  const keywordScore =
    keywords1.size > 0 ? (keywordMatches / keywords1.size) * 100 : 0;
  const conceptScore =
    concepts1.size > 0 ? (conceptMatches / concepts1.size) * 100 : 0;

  // Concepts are more important (60% weight)
  const finalScore = conceptScore * 0.6 + keywordScore * 0.4;

  return {
    score: Math.min(100, finalScore),
    matchedConcepts,
  };
};

const getImageMatchReason = (score: number): MatchReason => {
  let messageKey = "image.low";
  if (score >= 95) messageKey = "image.excellent";
  else if (score >= 80) messageKey = "image.very_good";
  else if (score >= 60) messageKey = "image.good";
  else if (score >= 40) messageKey = "image.moderate";

  return {
    type: "image",
    score: Math.round(score),
    messageKey,
    details: `${Math.round(score)}% match`,
  };
};

const calculateBreedSimilarity = (breed1: string, breed2: string): number => {
  if (!breed1 || !breed2) return 20;

  const b1 = breed1.toLowerCase().trim();
  const b2 = breed2.toLowerCase().trim();

  if (b1 === b2) return 100;
  if (b1.includes(b2) || b2.includes(b1)) return 85;

  const variations: Record<string, string[]> = {
    golden: ["golden", "golden retriever", "golden lab"],
    labrador: ["lab", "labrador", "labs"],
    shepherd: ["shepherd", "gsd", "german shepherd"],
    corgi: ["corgi", "pembroke", "cardigan"],
    poodle: ["poodle", "toy", "miniature"],
    spaniel: ["spaniel", "cocker"],
    persian: ["persian", "longhair"],
    siamese: ["siamese", "thai"],
    mixed: ["mixed", "mutt", "crossbreed"],
  };

  for (const [, list] of Object.entries(variations)) {
    const b1InList = list.some((v) => b1.includes(v));
    const b2InList = list.some((v) => b2.includes(v));
    if (b1InList && b2InList) return 75;
  }

  return 20;
};

const getBreedMatchReason = (score: number): MatchReason => {
  let messageKey = "breed.low";
  if (score >= 95) messageKey = "breed.exact";
  else if (score >= 75) messageKey = "breed.very_similar";
  else if (score >= 60) messageKey = "breed.similar";

  return {
    type: "breed",
    score: Math.round(score),
    messageKey,
    details: `${Math.round(score)}% match`,
  };
};

const calculateLocationSimilarity = (
  lat1: number | undefined,
  lng1: number | undefined,
  lat2: number | undefined,
  lng2: number | undefined,
): { similarity: number; distance: number; reason: MatchReason } => {
  if (!lat1 || !lng1 || !lat2 || !lng2) {
    return {
      similarity: 30,
      distance: 999,
      reason: {
        type: "location",
        score: 0,
        messageKey: "location.far",
      },
    };
  }

  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  const similarity = Math.max(10, 100 - distance * 8);

  let messageKey = "location.far";
  if (distance < 1) messageKey = "location.very_close";
  else if (distance < 3) messageKey = "location.close";
  else if (distance < 10) messageKey = "location.moderate";

  return {
    similarity,
    distance,
    reason: {
      type: "location",
      score: Math.round(similarity),
      messageKey,
      details: `${Math.round(distance * 10) / 10}km`,
    },
  };
};

const calculateTimeSimilarity = (
  date1: string,
  date2: string,
): { similarity: number; days: number; reason: MatchReason } => {
  const d1 = new Date(date1).getTime();
  const d2 = new Date(date2).getTime();
  const diffMs = Math.abs(d1 - d2);
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  let similarity = 100;
  let messageKey = "time.same_day";

  if (days > 14) {
    similarity = 20;
    messageKey = "time.old";
  } else if (days > 7) {
    similarity = 40;
    messageKey = "time.moderate";
  } else if (days > 3) {
    similarity = 70;
    messageKey = "time.few_days";
  } else if (days > 1) {
    similarity = 85;
    messageKey = "time.two_days";
  }

  return {
    similarity,
    days,
    reason: {
      type: "time",
      score: Math.round(similarity),
      messageKey,
      details: `${days} days`,
    },
  };
};

const getDescriptionMatchReason = (score: number): MatchReason => {
  let messageKey = "description.moderate";
  if (score >= 80) messageKey = "description.perfect";
  else if (score >= 60) messageKey = "description.excellent";
  else if (score >= 40) messageKey = "description.good";

  return {
    type: "description",
    score: Math.round(score),
    messageKey,
    details: `${Math.round(score)}% match`,
  };
};

// ✅ MAIN MATCHING FUNCTION
export const findPetMatches = async (
  queryPet: PetForMatching,
  candidatePets: PetForMatching[],
): Promise<PossibleMatch> => {
  const matches: MatchResult[] = [];

  const validCandidates = candidatePets.filter(
    (p) =>
      p.role !== queryPet.role &&
      p.petType === queryPet.petType &&
      p._id !== queryPet._id,
  );

  if (validCandidates.length === 0) {
    return { pet: queryPet, matches: [] };
  }

  for (const candidate of validCandidates) {
    const reasons: MatchReason[] = [];

    // Advanced image similarity
    const imageMatch = await calculateAdvancedImageSimilarity(
      queryPet.image,
      candidate.image,
    );
    if (imageMatch > 25) {
      reasons.push(getImageMatchReason(imageMatch));
    }

    // Breed similarity
    const breedMatch = calculateBreedSimilarity(
      queryPet.breed,
      candidate.breed,
    );
    if (breedMatch > 15) {
      reasons.push(getBreedMatchReason(breedMatch));
    }

    // Location similarity
    const locationData = calculateLocationSimilarity(
      queryPet.lat,
      queryPet.lng,
      candidate.lat,
      candidate.lng,
    );
    if (locationData.similarity > 10) {
      reasons.push(locationData.reason);
    }

    // Time similarity
    const timeData = calculateTimeSimilarity(
      queryPet.createdAt,
      candidate.createdAt,
    );
    if (timeData.similarity > 0) {
      reasons.push(timeData.reason);
    }

    // Pet type match
    const petTypeKey = queryPet.petType === "Dog" ? "type.dog" : "type.cat";
    reasons.push({
      type: "type",
      score: 100,
      messageKey: petTypeKey,
    });

    // Semantic description matching
    const descriptionData = calculateSemanticSimilarity(
      queryPet.description,
      candidate.description,
    );
    if (descriptionData.score > 20) {
      reasons.push(getDescriptionMatchReason(descriptionData.score));
    }

    // ✅ REFINED: Better weighted calculation
    const confidenceScore =
      imageMatch * 0.4 + // Image is most critical
      descriptionData.score * 0.2 + // Description concepts
      locationData.similarity * 0.15 + // Location
      breedMatch * 0.15 + // Breed
      timeData.similarity * 0.1; // Time

    if (confidenceScore > 40) {
      matches.push({
        matchId: candidate._id,
        matchName: candidate.name,
        confidenceScore: Math.round(confidenceScore),
        reasons: reasons.sort((a, b) => b.score - a.score),
        distance: Math.round(locationData.distance * 10) / 10,
        timeDiff: timeData.days,
        imageMatch: Math.round(imageMatch),
        breedMatch: Math.round(breedMatch),
        descriptionMatch: Math.round(descriptionData.score),
        locationMatch: Math.round(locationData.similarity),
        petType: candidate.petType,
        matchImage: candidate.image,
      });
    }
  }

  matches.sort((a, b) => b.confidenceScore - a.confidenceScore);

  return {
    pet: queryPet,
    matches: matches.slice(0, 15),
  };
};

export const findAllMatches = async (
  allPets: PetForMatching[],
): Promise<PossibleMatch[]> => {
  const results: PossibleMatch[] = [];

  const lostPets = allPets.filter((p) => p.role === "Lost");
  const foundPets = allPets.filter((p) => p.role === "Found");

  for (const lostPet of lostPets) {
    const matches = await findPetMatches(lostPet, foundPets);
    if (matches.matches.length > 0) {
      results.push(matches);
    }
  }

  return results.sort((a, b) => {
    const bestScoreA = a.matches[0]?.confidenceScore || 0;
    const bestScoreB = b.matches[0]?.confidenceScore || 0;
    return bestScoreB - bestScoreA;
  });
};

export const getMatchesForPet = async (
  petId: string,
  allPets: PetForMatching[],
): Promise<MatchResult[]> => {
  const queryPet = allPets.find((p) => p._id === petId);
  if (!queryPet) return [];

  const result = await findPetMatches(queryPet, allPets);
  return result.matches;
};
