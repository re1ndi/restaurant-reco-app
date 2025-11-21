const express = require('express');
require('dotenv').config();

require('./config/db'); // initialize DB connection
const recoRoutes = require('./routes/recoRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// root friendly info
app.get('/', (req, res) => {
  res.json({
    message: 'Restaurant Recommender API',
    usage: 'GET /api/recommendations?userId=1&lat=<lat>&lon=<lon>&maxDistance=<km>'
  });
});

app.use('/api/recommendations', recoRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
