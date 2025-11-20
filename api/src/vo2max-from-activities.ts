import fs from 'fs';
import path from 'path';

export type Vo2Point = {
  date: string;    // z.B. "2024-11-01"
  vo2max: number;  // z.B. 50.3
};

type SummarizedActivitiesRoot = {
  summarizedActivitiesExport: SummarizedActivity[];
};

type SummarizedActivity = {
  sportType?: string;
  activityType?: string;
  distance?: number;        // in cm
  duration?: number;        // in ms
  startTimeLocal?: number;  // ms seit Unix-Epoch
};

// Daniels-VO2max (vereinfachte Formel, v in m/min)
function calculateDanielsVo2(distanceKm: number, durationSec: number): number {
  const metersPerMin = (distanceKm * 1000) / (durationSec / 60);

  const vo2 =
    0.182258 * metersPerMin +
    0.000104 * metersPerMin * metersPerMin +
    0.8;

  return Math.round(vo2 * 10) / 10; // auf eine Nachkommastelle runden
}

export function getVo2SeriesFromFile(): Vo2Point[] {
  const filePath = path.join(
  process.cwd(),
  'api',
  'src',
  'data',
  'sebastiank2892@gmail.com_0_summarizedActivities.json'
);

console.log('Lese VO2-Daten aus:', filePath);

  const raw = fs.readFileSync(filePath, 'utf-8');

  const parsed = JSON.parse(raw) as SummarizedActivitiesRoot[];
  const activities = parsed[0]?.summarizedActivitiesExport ?? [];

  const points: Vo2Point[] = activities
    .filter((a) =>
      (a.sportType === 'RUNNING' || a.activityType === 'running') &&
      typeof a.distance === 'number' &&
      typeof a.duration === 'number' &&
      a.distance! > 0 &&
      a.duration! > 0
    )
    .map((a) => {
      // Garmin: distance in cm, duration in ms
      const distanceKm = a.distance! / 100_000; // cm -> km
      const durationSec = a.duration! / 1_000;  // ms -> s

      const vo2max = calculateDanielsVo2(distanceKm, durationSec);

      const date = a.startTimeLocal
        ? new Date(a.startTimeLocal).toISOString().slice(0, 10) // "YYYY-MM-DD"
        : '';

      return { date, vo2max };
    });

  // nach Datum sortieren (aufsteigend)
  points.sort((a, b) => a.date.localeCompare(b.date));

  return points;
}

// kleiner Test, falls du die Datei direkt mit ts-node/node startest
if (require.main === module) {
  console.log(getVo2SeriesFromFile().slice(0, 5));
}