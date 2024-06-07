const router = require('express').Router();
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

router.get('/api', async (req, res) => {
  const url = process.env.API_URL;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
        'Content-type': 'application/json',
      },
    });

    return res.status(200).json(response.data);
  } catch (error) {
    console.error(`Error fetching data: ${error.message}`);
    if (error.response) {
      return res.status(error.response.status).json({
        message: error.response.statusText,
      });
    } else if (error.request) {
      return res.status(500).json({
        error: 'No response received from the server',
      });
    } else {
      return res.status(500).json({
        error: 'Internal Server Error',
      });
    }
  }
});

module.exports = router;
