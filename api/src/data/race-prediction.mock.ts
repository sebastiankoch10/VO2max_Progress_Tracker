export function mockRacePrediction(vo2max: number) {


    return {
        vo2max,
        prediction:{
            '5K': parseFloat((vo2max * 12.5).toFixed(2)),
            '10K': parseFloat((vo2max * 26).toFixed(2)),
            'Half Marathon': parseFloat((vo2max * 55).toFixed(2)),
            'Marathon': parseFloat((vo2max * 115).toFixed(2))
         }
    };
}