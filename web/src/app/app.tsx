import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

type Vo2Point = {
  date: string;
  vo2max: number;
};

type RacePrediction = {
  vo2max: number;
  prediction: {
    '5K': number;
    '10K': number;
    'Half Marathon': number;
    'Marathon': number;
  };
};

function App() {

  function formatRaceTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s
      .toString()
      .padStart(2, '0')}`;
  }

  return `${m}:${s.toString().padStart(2, '0')}`;
}

  const [data, setData] = useState<Vo2Point[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [vo2Input, setVo2Input] = useState<string>('50');
  const [racePrediction, setRacePrediction] = useState<RacePrediction | null>(null);
  const [raceError, setRaceError] = useState<string | null>(null);
  const [raceLoading, setRaceLoading] = useState(false);

async function fetchRacePrediction() {
  setRaceLoading(true);
  setRaceError(null);

  const vo2 = Number(vo2Input);
  if (Number.isNaN(vo2) || vo2 <= 0) {
    setRaceError('Bitte eine gültige VO₂max > 0 eingeben.');
    setRaceLoading(false);
    return;
  }

  try {
    const res = await fetch(
  `http://localhost:3333/api/vo2max/race-prediction?vo2max=${vo2}`
);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const json = await res.json();
    setRacePrediction(json);
  } catch (err: any) {
    setRaceError(err.message ?? 'Unknown error');
  } finally {
    setRaceLoading(false);
  }
}


  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('http://localhost:3333/api/vo2max/trend');
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message ?? 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) return <p>Loading VO₂max trend…</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif', maxWidth: 800, margin: '0 auto' }}>
      <h1>VO₂max Progress Tracker</h1>

      <h2>VO₂max Trend</h2>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="vo2max" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <h2>Race Prediction</h2>
<div style={{ marginBottom: '1rem' }}>
  <label>
    VO₂max:&nbsp;
    <input
      type="number"
      value={vo2Input}
      onChange={(e) => setVo2Input(e.target.value)}
      style={{ width: '80px' }}
    />
  </label>
  <button onClick={fetchRacePrediction} style={{ marginLeft: '0.5rem' }}>
    Berechnen
  </button>
</div>

{raceLoading && <p>Berechne Prognose…</p>}
{raceError && <p style={{ color: 'red' }}>Error: {raceError}</p>}

{racePrediction && (
  <div>
    <p>Verwendete VO₂max: {racePrediction.vo2max}</p>
    <ul>
      <li>5K: {formatRaceTime(racePrediction.prediction['5K'])}</li>
      <li>10K: {formatRaceTime(racePrediction.prediction['10K'])}</li>
      <li>
        Halbmarathon:{' '}
        {formatRaceTime(racePrediction.prediction['Half Marathon'])}
      </li>
      <li>
        Marathon:{' '}
        {formatRaceTime(racePrediction.prediction['Marathon'])}
      </li>
    </ul>
  </div>
)}



      <h3>Raw data</h3>
      <ul>
        {data.map((point) => (
          <li key={point.date}>
            {point.date}: {point.vo2max}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
