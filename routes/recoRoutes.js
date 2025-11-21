const express = require('express');
const router = express.Router();
const { getRecommendations, getModuleLines } = require('../services/recoService');

router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    const latRaw = req.query.lat;
    const lonRaw = req.query.lon;
    const maxDistanceRaw = req.query.maxDistance ?? req.query.maxdistance ?? '10';

    if (latRaw === undefined || lonRaw === undefined) {
      return res.status(400).json({ message: 'Latitude (lat) and Longitude (lon) query parameters are required.' });
    }

    const lat = parseFloat(latRaw);
    const lon = parseFloat(lonRaw);
    const maxDistance = parseFloat(maxDistanceRaw);

    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      return res.status(400).json({ message: 'lat and lon must be valid numbers.' });
    }

    if (!Number.isFinite(maxDistance) || maxDistance <= 0) {
      return res.status(400).json({ message: 'maxDistance must be a positive number.' });
    }

    // If caller requests module view, return textual lines only
    if ((req.query.format || '').toLowerCase() === 'module') {
      const lines = await getModuleLines(userId, lat, lon, maxDistance);
      return res.json({ view: 'module', lines });
    }

    const recommendations = await getRecommendations(userId, lat, lon, maxDistance);

    res.json({
      user_input: { userId, lat, lon, maxDistance },
      recommendations
    });
  } catch (err) {
    console.error('Error fetching recommendations:', err);
    // If it's a known invalid params error from model, return 400
    if (err && /Invalid numeric parameters/i.test(err.message)) {
      return res.status(400).json({ message: 'Invalid numeric parameters in request.', details: err.message });
    }
    res.status(500).json({ message: 'Internal server error.', details: err.message });
  }
});

module.exports = router;
