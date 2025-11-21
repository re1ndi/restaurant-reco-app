const db = require('../config/db');

function getNearbyRestaurants(userLat, userLon, maxDistance = 5) {
  return new Promise((resolve, reject) => {
    if (isNaN(userLat) || isNaN(userLon) || isNaN(maxDistance)) {
      return reject(new Error('Invalid numeric parameters'));
    }

    const sql = `
      SELECT
        id,
        name,
        latitude,
        longitude,
        category,
        avg_rating,
        (6371 * acos(
           cos(radians(?)) * cos(radians(latitude)) *
           cos(radians(longitude) - radians(?)) +
           sin(radians(?)) * sin(radians(latitude))
        )) AS distance_km
      FROM restaurants
      HAVING distance_km <= ?
      ORDER BY distance_km ASC;
    `;

    const params = [userLat, userLon, userLat, maxDistance];

    db.query(sql, params, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
}

function getUserPreferences(userId) {
  return {
    'Italia': 5,
    'Seafood': 3,
    'Jawa': 1,
    'Dessert': 2
  };
}

module.exports = { getNearbyRestaurants, getUserPreferences };
