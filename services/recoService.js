const restaurantModel = require('../models/restaurantModel');
const { normalizeDistanceScore, normalizeRatingScore } = require('../utils/normalizer');

const WEIGHT_DISTANCE = 0.5;
const WEIGHT_RATING = 0.3;
const WEIGHT_PREFERENCE = 0.2;

async function getRecommendations(userId, userLat, userLon, maxDistance = 5) {
  const nearbyRestos = await restaurantModel.getNearbyRestaurants(userLat, userLon, maxDistance);
  const userPrefs = restaurantModel.getUserPreferences(userId);

  const scored = nearbyRestos.map(r => {
    const distance = parseFloat(r.distance_km);
    const rating = parseFloat(r.avg_rating);
    const prefValue = userPrefs[r.category] || 0;

    const S_d = normalizeDistanceScore(distance, maxDistance);
    const S_r = normalizeRatingScore(rating);
    const S_p = normalizeRatingScore(prefValue);

    const finalScoreNum = (WEIGHT_DISTANCE * S_d) + (WEIGHT_RATING * S_r) + (WEIGHT_PREFERENCE * S_p);

    return {
      id: r.id,
      name: r.name,
      category: r.category,
      avg_rating: rating,
      distance_km: Number(distance).toFixed(2),
      distance_score: Number(S_d.toFixed(4)),
      rating_score: Number(S_r.toFixed(4)),
      preference_score: Number(S_p.toFixed(4)),
      finalScore: Number(finalScoreNum.toFixed(4))
    };
  });

  // Sort numerically by finalScore desc, then by distance asc as tie-breaker
  scored.sort((a, b) => {
    if (b.finalScore !== a.finalScore) return b.finalScore - a.finalScore;
    return parseFloat(a.distance_km) - parseFloat(b.distance_km);
  });

  return scored;
}

module.exports = { getRecommendations };
// Produce module-style textual descriptions for each recommendation
async function getModuleLines(userId, userLat, userLon, maxDistance = 5) {
  const recs = await getRecommendations(userId, userLat, userLon, maxDistance);

  function distanceLabel(km) {
    const d = parseFloat(km);
    if (d <= 0.5) return 'Jarak Sangat Dekat';
    if (d <= 1.5) return 'Jarak Dekat';
    if (d <= 3.0) return 'Jarak Sedang';
    return 'Jarak Lebih Jauh';
  }

  function ratingLabel(rating) {
    if (rating >= 4.5) return 'Rating Tinggi';
    if (rating >= 4.0) return 'Rating Sedang';
    return 'Rating Rendah';
  }

  function preferenceLabel(pref) {
    if (pref >= 5) return 'Preferensi Sangat Tinggi';
    if (pref >= 3) return 'Preferensi Sedang';
    return 'Preferensi Rendah';
  }

  // Mock preferences used in model; use same source to get numeric pref
  const userPrefs = require('../models/restaurantModel').getUserPreferences(userId);

  const lines = recs.map((r, idx) => {
    const prefVal = userPrefs[r.category] || 0;
    const dLabel = distanceLabel(r.distance_km);
    const rLabel = ratingLabel(r.avg_rating);
    const pLabel = preferenceLabel(prefVal);

    const ordinal = idx + 1;
    return `${ordinal}. ${r.name} (${r.category}): ${dLabel}, ${rLabel}, ${pLabel}.`;
  });

  return lines;
}

module.exports.getModuleLines = getModuleLines;
