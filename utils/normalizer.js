function normalizeDistanceScore(distance, maxDistance = 10) {
  return 1 - (Math.min(distance, maxDistance) / maxDistance);
}

function normalizeRatingScore(rating, maxRating = 5) {
  return Math.max(0, Math.min(1, rating / maxRating));
}

module.exports = { normalizeDistanceScore, normalizeRatingScore };
