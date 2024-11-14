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

const moodToValence = {
    Happy: { min: 0.7, max: 1.0 },
    Sad: { min: 0.0, max: 0.3 },
    Energetic: { min: 0.6, max: 0.9 },
    Relaxed: { min: 0.3, max: 0.6 },
    Angry: { min: 0.0, max: 0.3 },
    Motivated: { min: 0.5, max: 0.9 },
    Romantic: { min: 0.0, max: 0.4 }
  };

async function getAccessToken() {
    try {
      const authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: {
          'Authorization': 'Basic ' + Buffer.from(spotify_id + ':' + spotify_key).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: 'grant_type=client_credentials',
      };
  
      // Sending POST request using axios
      const response = await axios.post(authOptions.url, authOptions.data, { headers: authOptions.headers });
  
      // Get the access token from the response
      const token = response.data.access_token;

      return token;

    } catch (error) {
        console.error('Error fetching access token:', error);
      throw error;
    }
  }

app.get('/api/spotify/recommendation', async (req, res) => {
    const mood = req.query.mood;

    const token = await getAccessToken();
    const {min, max} = moodToValence[mood];

    console.log("Mood:" + mood + "Min Valence: " + min + "Max Valence: " + max);

    const response = await axios.get('https://api.spotify.com/v1/recommendations', {
        headers: { Authorization: `Bearer ${token}`},
        params: {
            seed_genres: 'pop',
            target_valence: Math.random() * ( max - min ) + min,
            limit: 10
        },
    });

    res.json({ recommendations: response.data.tracks });
})
    
app.listen(port, () => {
    console.log(`Backend API running at http://localhost:${port}`);
})