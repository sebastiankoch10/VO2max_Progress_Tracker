/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express';
import * as path from 'path';
import { getVo2SeriesFromFile } from './vo2max-from-activities';
import { mockRacePrediction } from './data/race-prediction.mock';
import cors from 'cors';
import { get } from 'http';



const app = express();

app.use(cors());
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to api!' });
});

//Route: Vo2max Serie 
app.get('/api/vo2max', (req, res) => {
  try {
    const series = getVo2SeriesFromFile();
    res.json(series);
  } catch (err) {
    console.error('Error loading VO2 series', err);
    res.status(500).json({ error: 'Failed to load VO2 series' });
  }
});


//Route: Race Prediction
app.get('/api/vo2max/race-prediction', (req, res) => {
  const vo2max = Number(req.query.vo2max) || 50; // Default VO2max value
  const prediction = mockRacePrediction(vo2max);
  res.json(prediction);
});

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
