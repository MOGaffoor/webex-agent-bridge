const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/webhook', async (req, res) => {
  const message = req.body.data.text;
  const sender = req.body.data.personEmail;

  try {
    const response = await axios.post(process.env.AGENT_STUDIO_ENDPOINT, {
      message,
      sender
    });

    const reply = response.data.reply;

    await axios.post('https://webexapis.com/v1/messages', {
      roomId: req.body.data.roomId,
      text: reply
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.WEBEX_BOT_TOKEN}`
      }
    });

    res.status(200).send('Message sent');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
