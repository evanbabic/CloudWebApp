import express from 'express';
import cors from 'cors';

const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());

app.get('/api/test', (req, res) => {
    res.json({message: 'GET path is working!', status: 'success'});
})

app.get('/api/playlist', (req, res) => {
    const mood = req.query.mood;
    console.log(mood);
    res.json({message: 'GET path is working! Mood: ' + mood, status: 'success'});
})

app.listen(port, () => {
    console.log("Backend API running at http://localhost:${port}");
})