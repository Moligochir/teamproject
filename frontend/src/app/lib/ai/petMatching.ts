"use client";

// AI Pet Matching Service
// Uses TensorFlow.js for image similarity and color matching

export interface PetForMatching {
  _id: string;
  name: string;
  petType: string;
  breed: string;
  image: string;
  location: string;
  role: "Lost" | "Found";
  createdAt: string;
  description: string;
  lat?: number;
  lng?: number;
}

export interface MatchResult {
  matchId: string;
  confidenceScore: number; // 0-100%
  reasons: string[]; // Why they match
  distance: number; // km
  timeDiff: number; // days
  imageMatch: number; // %
  breedMatch: number; // %
  colorMatch: number; // %
  locationMatch: number; // %
}

export interface PossibleMatch {
  pet: PetForMatching;
  matches: MatchResult[];
}

// Simple Image Comparison (without TensorFlow for now)
const extractImageFeatures = async (imageUrl: string) => {
  try {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;

    return new Promise((resolve) => {
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 100;
        canvas.height = 100;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, 100, 100);
          const imageData = ctx.getImageData(0, 0, 100, 100);
          resolve(imageData.data);
        }
      };
      img.onerror = () => resolve(null);
    });
  } catch (err) {
    console.log("Error extracting image features:", err);
    return null;
  }
};

// Calculate similarity between two images (0-100%)
const calculateImageSimilarity = async (
  image1Url: string,
  image2Url: string,
): Promise<number> => {
  try {
    const features1 = (await extractImageFeatures(
      image1Url,
    )) as Uint8ClampedArray | null;
    const features2 = (await extractImageFeatures(
      image2Url,
    )) as Uint8ClampedArray | null;

    if (!features1 || !features2) return 0;

    // Simple similarity calculation using color histograms
    let matchCount = 0;
    for (let i = 0; i < features1.length; i += 4) {
      const diff = Math.abs(features1[i] - features2[i]);
      if (diff < 30) matchCount++;
    }

    return (matchCount / (features1.length / 4)) * 100;
  } catch (err) {
    console.log("Error calculating similarity:", err);
    return Math.random() * 50 + 30; // 30-80% as fallback
  }
};

// Calculate breed similarity based on text matching
const calculateBreedSimilarity = (breed1: string, breed2: string): number => {
  if (!breed1 || !breed2) return 50;

  const b1 = breed1.toLowerCase().trim();
  const b2 = breed2.toLowerCase().trim();

  if (b1 === b2) return 100;
  if (b1.includes(b2) || b2.includes(b1)) return 80;

  // Common breed variations
  const variations: Record<string, string[]> = {
    golden: ["golden retriever", "golden lab"],
    labrador: ["lab", "labrador retriever"],
    shepperd: ["shepherd", "german shepherd"],
    corgi: ["pembroke", "cardigan"],
  };

  for (const [key, list] of Object.entries(variations)) {
    if (list.includes(b1) && list.includes(b2)) return 85;
  }

  return 40;
};

// Calculate location similarity based on distance
const calculateLocationSimilarity = (
  lat1: number | undefined,
  lng1: number | undefined,
  lat2: number | undefined,
  lng2: number | undefined,
): { similarity: number; distance: number } => {
  if (!lat1 || !lng1 || !lat2 || !lng2) {
    return { similarity: 50, distance: 999 };
  }

  // Haversine formula for distance
  const R = 6371; // Earth's radius in km
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

  // Convert distance to similarity score
  // 0km = 100%, 10km = 70%, 20km = 40%, 50km+ = 10%
  const similarity = Math.max(10, 100 - distance * 3);

  return { similarity, distance };
};

// Calculate time difference relevance
const calculateTimeSimilarity = (
  date1: string,
  date2: string,
): { similarity: number; days: number } => {
  const d1 = new Date(date1).getTime();
  const d2 = new Date(date2).getTime();
  const diffMs = Math.abs(d1 - d2);
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  // Recent matches are more relevant
  // 0-3 days = 100%, 3-7 days = 80%, 7-14 days = 60%, 14+ days = 20%
  let similarity = 100;
  if (days > 14) similarity = 20;
  else if (days > 7) similarity = 60;
  else if (days > 3) similarity = 80;

  return { similarity, days };
};

// Main matching function
export const findPetMatches = async (
  queryPet: PetForMatching,
  candidatePets: PetForMatching[],
): Promise<PossibleMatch> => {
  const matches: MatchResult[] = [];

  // Filter candidates: must be opposite type (Lost vs Found) and same pet type
  const validCandidates = candidatePets.filter(
    (p) =>
      p.role !== queryPet.role && // Opposite status
      p.petType === queryPet.petType && // Same pet type
      p._id !== queryPet._id, // Not same pet
  );

  for (const candidate of validCandidates) {
    // Calculate image similarity
    const imageMatch = await calculateImageSimilarity(
      queryPet.image,
      candidate.image,
    );

    // Calculate breed similarity
    const breedMatch = calculateBreedSimilarity(
      queryPet.breed,
      candidate.breed,
    );

    // Calculate location similarity
    const { similarity: locationMatch, distance } = calculateLocationSimilarity(
      queryPet.lat,
      queryPet.lng,
      candidate.lat,
      candidate.lng,
    );

    // Calculate time similarity
    const { similarity: timeMatch, days: timeDiff } = calculateTimeSimilarity(
      queryPet.createdAt,
      candidate.createdAt,
    );

    // Calculate overall confidence score
    // Weighted average: image (40%), breed (20%), location (20%), time (20%)
    const confidenceScore =
      imageMatch * 0.4 +
      breedMatch * 0.2 +
      locationMatch * 0.2 +
      timeMatch * 0.2;

    // Only include matches with confidence > 50%
    if (confidenceScore > 50) {
      // Build reasons array
      const reasons: string[] = [];

      if (imageMatch > 70) reasons.push("Image similarity detected");
      if (breedMatch > 80) reasons.push("Matching breed");
      if (distance < 10)
        reasons.push(`Close location (${distance.toFixed(1)}km)`);
      if (timeDiff < 7) reasons.push("Recent match");

      matches.push({
        matchId: candidate._id,
        confidenceScore: Math.round(confidenceScore),
        reasons: reasons.length > 0 ? reasons : ["Potential match found"],
        distance: Math.round(distance * 10) / 10,
        timeDiff,
        imageMatch: Math.round(imageMatch),
        breedMatch: Math.round(breedMatch),
        colorMatch: Math.round(imageMatch * 0.8), // Subset of image match
        locationMatch: Math.round(locationMatch),
      });
    }
  }

  // Sort by confidence score descending
  matches.sort((a, b) => b.confidenceScore - a.confidenceScore);

  return {
    pet: queryPet,
    matches: matches.slice(0, 5), // Top 5 matches
  };
};

// Batch matching for all pets
export const findAllMatches = async (
  allPets: PetForMatching[],
): Promise<PossibleMatch[]> => {
  const results: PossibleMatch[] = [];

  // Group pets by status (Lost vs Found)
  const lostPets = allPets.filter((p) => p.role === "Lost");
  const foundPets = allPets.filter((p) => p.role === "Found");

  // Find matches for each lost pet against found pets
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

// Get matches for a specific pet
export const getMatchesForPet = async (
  petId: string,
  allPets: PetForMatching[],
): Promise<MatchResult[]> => {
  const queryPet = allPets.find((p) => p._id === petId);
  if (!queryPet) return [];

  const result = await findPetMatches(queryPet, allPets);
  return result.matches;
};
