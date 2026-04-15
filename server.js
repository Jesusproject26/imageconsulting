require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

let analytics = {
  pageViews: 0,
  messagesReceived: 0,
  lastMessages: []
};

app.get('/', (req, res) => {
  analytics.pageViews++;
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body || {};
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  analytics.messagesReceived++;
  analytics.lastMessages.unshift({ name, email, message, date: new Date().toISOString() });
  analytics.lastMessages = analytics.lastMessages.slice(0, 10);

  console.log('New contact message:', { name, email, message });

  const socialText = `New inquiry from ${name} via Civil Image Consulting website.`;
  try {
    await postToSocials(socialText);
  } catch (err) {
    console.error('Error posting to socials:', err.message);
  }

  return res.json({ success: true, message: 'Thank you for contacting Civil Image Consulting!' });
});

app.get('/api/analytics', (req, res) => {
  res.json(analytics);
});

async function postToSocials(text) {
  console.log('Posting to Twitter:', text);
  console.log('Posting to Facebook:', text);
  console.log('Posting to LinkedIn:', text);
}

app.listen(PORT, () => {
  console.log(`Civil Image Consulting server running on port ${PORT}`);
});
