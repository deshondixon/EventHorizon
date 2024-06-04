const router = require('express').Router();
const dotenv = require('dotenv');
dotenv.config();

router.get('/api', async (req, res) => {
  const url = `https://api.predicthq.com/v1/events`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
        'Content-type': 'application/json',
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({
        message: response.statusText,
      });
    }

    const data = await response.json();
    console.log(`This Api Data: ${JSON.stringify(data)}`);

    return res.status(200).json(data);
  } catch (error) {
    console.error(`Error fetching data: ${error.message}`);
    return res.status(500).json({
      error: 'Internal Server Error',
    });
  }
});

module.exports = router;
