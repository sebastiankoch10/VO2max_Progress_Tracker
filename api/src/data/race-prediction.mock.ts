export function mockRacePrediction(vo2max: number) {

    const vVo2 = ((vo2max - 3.5) / 0.2) / 60; 

    function predictTime(distanceMeters: number, factor: number): number {
        const raceSpeed = vVo2 * factor; //m/s
        const timeSeconds = distanceMeters / raceSpeed;
        return Math.round(timeSeconds); 
    }

    return {
  vo2max,
  prediction: {
    '5K': predictTime(5000, 0.87),
    '10K': predictTime(10000, 0.83),
    'Half Marathon': predictTime(21097, 0.78),
    'Marathon': predictTime(42195, 0.70),
  },
};

}