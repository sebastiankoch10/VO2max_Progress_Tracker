/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express';
import * as path from 'path';
import { mockVo2maxTrend } from './data/vo2max-trend.mock'; 
import { mockRacePrediction } from './data/race-prediction.mock';
import cors from 'cors';



const app = express();

app.use(cors());
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to api!' });
});

//Route: Vo2max Verlauf
app.get('/api/vo2max/trend', (req, res) => {
  res.json(mockVo2maxTrend);
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
