import express from 'express';
import cors from 'cors';
import axios from 'axios';
import { Buffer } from 'buffer';

const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());

//Spotify Credentials
const spotify_id = '265a35c19fa64c44b3c3c18c4b62c41c';
const spotify_key = '84610de64a2a45d38042977f7903bfd6';
let token = null;
let token_expiry = null;

//Mapping Different Moods to Different Search Filters

const moodToValence = {
    Happy: { min: 0.7, max: 1.0 },
    Sad: { min: 0.0, max: 0.3 },
    Energetic: { min: 0.6, max: 0.9 },
    Relaxed: { min: 0.3, max: 0.6 },
    Angry: { min: 0.0, max: 0.3 },
    Motivated: { min: 0.5, max: 0.9 },
    Romantic: { min: 0.0, max: 0.4 }
};

const moodToEnergy = {
  Happy: { min: 0.7, max: 1.0 },
  Sad: { min: 0.2, max: 0.4 },
  Energetic: { min: 0.8, max: 1.0 },
  Relaxed: { min: 0.2, max: 0.5 },
  Angry: { min: 0.7, max: 1.0 },
  Motivated: { min: 0.7, max: 1.0 },
  Romantic: { min: 0.4, max: 0.6 }
}

const moodToDanceability = {
  Happy: { min: 0.7, max: 1.0 },
  Sad: { min: 0.2, max: 0.4 },
  Energetic: { min: 0.8, max: 1.0 },
  Relaxed: { min: 0.4, max: 0.6 },
  Angry: { min: 0.3, max: 0.5 },
  Motivated: { min: 0.7, max: 1.0 },
  Romantic: { min: 0.5, max: 0.7 }
}

const moodToTempo = {
  Happy: { min: 110, max: 130 },
  Sad: { min: 60, max: 90 },
  Energetic: { min: 120, max: 160 },
  Relaxed: { min: 70, max: 100 },
  Angry: { min: 100, max: 140 },
  Motivated: { min: 120, max: 160 },
  Romantic: { min: 80, max: 110 }
}

const moodToGenres = {
  Happy: ['pop', 'dance', 'indie-pop', 'funk', 'house'],
  Sad: ['blues', 'alternative', 'shoegaze', 'emo', 'indie-folk'],
  Energetic: ['edm', 'rock', 'hip-hop', 'pop', 'dance'],
  Relaxed: ['chillwave', 'jazz', 'indie-folk', 'ambient', 'acoustic'],
  Angry: ['hard-rock', 'metal', 'punk', 'hip-hop', 'hardcore'],
  Motivated: ['hip-hop', 'edm', 'rock', 'pop', 'trap'],
  Romantic: ['r&b', 'jazz', 'soul', 'indie-pop', 'romantic']
}

// Randomizer function allowing for some variation of returned results

const getRandomizedValue = (min, max, variationFactor = 0.1) => {
  const range = max - min;
  const variation = range * variationFactor;
  const lower = Math.max(min, min + Math.random() * variation - variation / 2);
  const upper = Math.min(max, max + Math.random() * variation - variation / 2);
  return Math.random() * (upper - lower) + lower;
}

// Function to get access token from Spotify to use recommendation API

async function getAccessToken() {

  // Avoids repeatedly calling for token if token is still valid
  if (token && Date.now() < token_expiry) { return token; }

  console.log("Fetching token!")

  try {
    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(spotify_id + ':' + spotify_key).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: 'grant_type=client_credentials',
    };
  
    const response = await axios.post(authOptions.url, authOptions.data, { headers: authOptions.headers });
    token = response.data.access_token;
    token_expiry = Date.now() + (response.data.expires_in * 1000);

    return token;

  } catch (error) {
      console.error('Error fetching access token:', error);
    throw error;
  }
}

// After getting token, use it + search filters to get list of songs

app.get('/api/spotify/recommendation', async (req, res) => {

  console.log("Fetching recommendation");

  const mood = req.query.mood;
  const token = await getAccessToken();

  const {valenceMin, valenceMax} = moodToValence[mood];
  const {energyMin, energyMax} = moodToEnergy[mood];
  const {danceMin, danceMax} = moodToDanceability[mood];
  const {tempoMin, tempoMax} = moodToTempo[mood];
  const genreList = moodToGenres[mood].join(',');
  
  const response = await axios.get('https://api.spotify.com/v1/recommendations', {
    headers: { Authorization: `Bearer ${token}`},
     params: {
        seed_genres: genreList,
        target_valence: getRandomizedValue(valenceMin, valenceMax, 0.15),
        target_energy: getRandomizedValue(energyMin, energyMax, 0.15),
        target_danceability: getRandomizedValue(danceMin, danceMax, 0.15),
        target_tempo: getRandomizedValue(tempoMin, tempoMax, 0.15),
        target_popularity: Math.round(getRandomizedValue(30, 100)),
        limit: 10
      },
  });
  
  res.json({ recommendations: response.data.tracks });
})
    
app.listen(port, () => {
    console.log(`Backend API running at http://localhost:${port}`);
})