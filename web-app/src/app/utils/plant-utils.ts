export const cropsList = [
    "Wheat",
    "Barley",
    "Canola",
    "Cabbage",
    "Cauliflower",
    "Broccoli",
    "Brussels sprouts",
    "Kale",
    "Collard greens",
    "Mustard greens",
    "Spinach",
    "Swiss chard",
    "Lettuce",
    "Arugula",
    "Radishes",
    "Beets",
    "Carrots",
    "Turnips",
    "Parsnips",
    "Potatoes",
    "Sweet potatoes",
    "Onions",
    "Garlic",
    "Chickpeas",
    "Faba beans",
    "Field peas",
    "Lentils",
    "Lupins",
    "Oats",
    "Triticale",
    "Grain sorghum",
    "Cottonseed",
    "Cotton lint",
    "Rice",
    "Corn (maize)",
    "Soybeans",
    "Sunflower",
    "Sugarcane",
    "Potatoes",
    "Sweet corn",
    "Alfalfa",
    "Millet",
    "Safflower",
    "Flaxseed",
    "Pigeon peas",
    "Mung beans",
    "Chia",
    "Pumpkins",
    "Carrots",
    "Tobacco",
    "Quinoa",
    "Hemp",
    "Beetroot",
  ];
  
  export type CropName = (typeof cropsList)[number];
  
  export interface CropAttributes {
    optimalTempRangeC: [number, number]; // Min and max optimal temperature in °C
    rainfallCorrelation: number; // Correlation coefficient with yield (-1 to 1)
    snowCorrelation: number; // Correlation coefficient with yield (-1 to 1)
    pestSensitivity: number; // Sensitivity to pests (0 low – 1 high)
    optimalSoilMoisture: [number, number]; // Min and max optimal soil moisture percentage
    optimalPrecipitation: [number, number]; // Min and max optimal precipitation in mm
  }
  
  export const cropAttributes: Record<CropName, CropAttributes> = {
    Wheat: {
      optimalTempRangeC: [40, 50],
      rainfallCorrelation: 0.7,
      snowCorrelation: -0.2,
      pestSensitivity: 0.6,
      optimalSoilMoisture: [15, 25],
      optimalPrecipitation: [450, 650], // Example: 450mm to 650mm of precipitation
    },
    Barley: {
      optimalTempRangeC: [10, 20],
      rainfallCorrelation: 0.6,
      snowCorrelation: -0.1,
      pestSensitivity: 0.5,
      optimalSoilMoisture: [10, 20],
      optimalPrecipitation: [400, 600], // Example: 400mm to 600mm of precipitation
    },
    Canola: {
      optimalTempRangeC: [8, 23],
      rainfallCorrelation: 0.8,
      snowCorrelation: -0.3,
      pestSensitivity: 0.7,
      optimalSoilMoisture: [10, 20],
      optimalPrecipitation: [450, 650], // Example: 450mm to 650mm of precipitation
    },
    Cabbage: {
      optimalTempRangeC: [10, 18],
      rainfallCorrelation: 0.5,
      snowCorrelation: -0.2,
      pestSensitivity: 0.4,
      optimalSoilMoisture: [20, 30],
      optimalPrecipitation: [400, 500], // Example: 400mm to 500mm of precipitation
    },
    Cauliflower: {
      optimalTempRangeC: [15, 20],
      rainfallCorrelation: 0.6,
      snowCorrelation: -0.1,
      pestSensitivity: 0.5,
      optimalSoilMoisture: [15, 25],
      optimalPrecipitation: [400, 550], // Example: 400mm to 550mm of precipitation
    },
    Broccoli: {
      optimalTempRangeC: [15, 23],
      rainfallCorrelation: 0.6,
      snowCorrelation: -0.1,
      pestSensitivity: 0.5,
      optimalSoilMoisture: [20, 30],
      optimalPrecipitation: [450, 600], // Example: 450mm to 600mm of precipitation
    },
    "Brussels sprouts": {
      optimalTempRangeC: [12, 18],
      rainfallCorrelation: 0.4,
      snowCorrelation: -0.3,
      pestSensitivity: 0.4,
      optimalSoilMoisture: [15, 25],
      optimalPrecipitation: [350, 500], // Example: 350mm to 500mm of precipitation
    },
    Kale: {
      optimalTempRangeC: [15, 20],
      rainfallCorrelation: 0.5,
      snowCorrelation: -0.2,
      pestSensitivity: 0.3,
      optimalSoilMoisture: [20, 30],
      optimalPrecipitation: [400, 550], // Example: 400mm to 550mm of precipitation
    },
    "Collard greens": {
      optimalTempRangeC: [15, 25],
      rainfallCorrelation: 0.5,
      snowCorrelation: -0.2,
      pestSensitivity: 0.3,
      optimalSoilMoisture: [20, 30],
      optimalPrecipitation: [450, 600], // Example: 450mm to 600mm of precipitation
    },
    "Mustard greens": {
      optimalTempRangeC: [10, 20],
      rainfallCorrelation: 0.5,
      snowCorrelation: -0.2,
      pestSensitivity: 0.4,
      optimalSoilMoisture: [15, 25],
      optimalPrecipitation: [400, 550], // Example: 400mm to 550mm of precipitation
    },
    Spinach: {
      optimalTempRangeC: [10, 16],
      rainfallCorrelation: 0.6,
      snowCorrelation: -0.2,
      pestSensitivity: 0.6,
      optimalSoilMoisture: [15, 25],
      optimalPrecipitation: [350, 500], // Example: 350mm to 500mm of precipitation
    },
    "Swiss chard": {
      optimalTempRangeC: [15, 21],
      rainfallCorrelation: 0.6,
      snowCorrelation: -0.2,
      pestSensitivity: 0.4,
      optimalSoilMoisture: [20, 30],
      optimalPrecipitation: [400, 550], // Example: 400mm to 550mm of precipitation
    },
    Lettuce: {
      optimalTempRangeC: [15, 18],
      rainfallCorrelation: 0.5,
      snowCorrelation: -0.1,
      pestSensitivity: 0.5,
      optimalSoilMoisture: [20, 30],
      optimalPrecipitation: [350, 500], // Example: 350mm to 500mm of precipitation
    },
    Arugula: {
      optimalTempRangeC: [10, 20],
      rainfallCorrelation: 0.4,
      snowCorrelation: -0.2,
      pestSensitivity: 0.3,
      optimalSoilMoisture: [20, 30],
      optimalPrecipitation: [400, 550], // Example: 400mm to 550mm of precipitation
    },
    Radishes: {
      optimalTempRangeC: [16, 24],
      rainfallCorrelation: 0.3,
      snowCorrelation: -0.1,
      pestSensitivity: 0.3,
      optimalSoilMoisture: [15, 25],
      optimalPrecipitation: [350, 500], // Example: 350mm to 500mm of precipitation
    },
    Beets: {
      optimalTempRangeC: [15, 18],
      rainfallCorrelation: 0.5,
      snowCorrelation: -0.1,
      pestSensitivity: 0.4,
      optimalSoilMoisture: [20, 30],
      optimalPrecipitation: [400, 550], // Example: 400mm to 550mm of precipitation
    },
    Carrots: {
      optimalTempRangeC: [16, 21],
      rainfallCorrelation: 0.6,
      snowCorrelation: -0.1,
      pestSensitivity: 0.4,
      optimalSoilMoisture: [15, 25],
      optimalPrecipitation: [350, 500], // Example: 350mm to 500mm of precipitation
    },
    Turnips: {
      optimalTempRangeC: [10, 18],
      rainfallCorrelation: 0.5,
      snowCorrelation: -0.1,
      pestSensitivity: 0.4,
      optimalSoilMoisture: [20, 30],
      optimalPrecipitation: [400, 550], // Example: 400mm to 550mm of precipitation
    },
    Parsnips: {
      optimalTempRangeC: [10, 18],
      rainfallCorrelation: 0.5,
      snowCorrelation: -0.2,
      pestSensitivity: 0.4,
      optimalSoilMoisture: [20, 30],
      optimalPrecipitation: [400, 550], // Example: 400mm to 550mm of precipitation
    },
    Potatoes: {
      optimalTempRangeC: [15, 18],
      rainfallCorrelation: 0.7,
      snowCorrelation: -0.1,
      pestSensitivity: 0.5,
      optimalSoilMoisture: [15, 25],
      optimalPrecipitation: [450, 650], // Example: 450mm to 650mm of precipitation
    },
    "Sweet potatoes": {
      optimalTempRangeC: [20, 30],
      rainfallCorrelation: 0.6,
      snowCorrelation: -0.5,
      pestSensitivity: 0.6,
      optimalSoilMoisture: [20, 30],
      optimalPrecipitation: [500, 700], // Example: 500mm to 700mm of precipitation
    },
    Onions: {
      optimalTempRangeC: [13, 24],
      rainfallCorrelation: 0.5,
      snowCorrelation: -0.2,
      pestSensitivity: 0.5,
      optimalSoilMoisture: [10, 20],
      optimalPrecipitation: [350, 500], // Example: 350mm to 500mm of precipitation
    },
    Garlic: {
      optimalTempRangeC: [13, 24],
      rainfallCorrelation: 0.5,
      snowCorrelation: -0.2,
      pestSensitivity: 0.4,
      optimalSoilMoisture: [10, 20],
      optimalPrecipitation: [350, 500], // Example: 350mm to 500mm of precipitation
    },
    Chickpeas: {
      optimalTempRangeC: [16, 30],
      rainfallCorrelation: 0.4,
      snowCorrelation: -0.3,
      pestSensitivity: 0.5,
      optimalSoilMoisture: [15, 25],
      optimalPrecipitation: [400, 600], // Example: 400mm to 600mm of precipitation
    },
    "Faba beans": {
      optimalTempRangeC: [18, 24],
      rainfallCorrelation: 0.6,
      snowCorrelation: -0.3,
      pestSensitivity: 0.5,
      optimalSoilMoisture: [20, 30],
      optimalPrecipitation: [450, 600], // Example: 450mm to 600mm of precipitation
    },
    "Field peas": {
      optimalTempRangeC: [10, 18],
      rainfallCorrelation: 0.6,
      snowCorrelation: -0.2,
      pestSensitivity: 0.5,
      optimalSoilMoisture: [20, 30],
      optimalPrecipitation: [400, 550], // Example: 400mm to 550mm of precipitation
    },
    Lentils: {
      optimalTempRangeC: [10, 22],
      rainfallCorrelation: 0.5,
      snowCorrelation: -0.2,
      pestSensitivity: 0.4,
      optimalSoilMoisture: [15, 25],
      optimalPrecipitation: [400, 600], // Example: 400mm to 600mm of precipitation
    },
    Lupins: {
      optimalTempRangeC: [15, 25],
      rainfallCorrelation: 0.6,
      snowCorrelation: -0.2,
      pestSensitivity: 0.5,
      optimalSoilMoisture: [20, 30],
      optimalPrecipitation: [450, 650], // Example: 450mm to 650mm of precipitation
    },
    Oats: {
      optimalTempRangeC: [10, 20],
      rainfallCorrelation: 0.6,
      snowCorrelation: -0.1,
      pestSensitivity: 0.4,
      optimalSoilMoisture: [15, 25],
      optimalPrecipitation: [400, 550], // Example: 400mm to 550mm of precipitation
    },
    Triticale: {
      optimalTempRangeC: [12, 20],
      rainfallCorrelation: 0.6,
      snowCorrelation: -0.1,
      pestSensitivity: 0.5,
      optimalSoilMoisture: [15, 25],
      optimalPrecipitation: [450, 600], // Example: 450mm to 600mm of precipitation
    },
    "Grain sorghum": {
      optimalTempRangeC: [20, 32],
      rainfallCorrelation: 0.7,
      snowCorrelation: -0.5,
      pestSensitivity: 0.6,
      optimalSoilMoisture: [10, 20],
      optimalPrecipitation: [500, 700], // Example: 500mm to 700mm of precipitation
    },
    Cottonseed: {
      optimalTempRangeC: [20, 30],
      rainfallCorrelation: 0.5,
      snowCorrelation: -0.5,
      pestSensitivity: 0.7,
      optimalSoilMoisture: [10, 20],
      optimalPrecipitation: [500, 700], // Example: 500mm to 700mm of precipitation
    },
    "Cotton (upland)": {
      optimalTempRangeC: [22, 32],
      rainfallCorrelation: 0.6,
      snowCorrelation: -0.6,
      pestSensitivity: 0.8,
      optimalSoilMoisture: [10, 20],
      optimalPrecipitation: [500, 700], // Example: 500mm to 700mm of precipitation
    },
    Rice: {
      optimalTempRangeC: [20, 35],
      rainfallCorrelation: 0.8,
      snowCorrelation: -0.5,
      pestSensitivity: 0.7,
      optimalSoilMoisture: [30, 40],
      optimalPrecipitation: [1000, 2000],
    },
    Soybeans: {
      optimalTempRangeC: [15, 30],
      rainfallCorrelation: 0.7,
      snowCorrelation: -0.3,
      pestSensitivity: 0.6,
      optimalSoilMoisture: [20, 30],
      optimalPrecipitation: [500, 800],
    },
    "Corn (maize)": {
      optimalTempRangeC: [18, 27],
      rainfallCorrelation: 0.75,
      snowCorrelation: -0.4,
      pestSensitivity: 0.65,
      optimalSoilMoisture: [25, 35],
      optimalPrecipitation: [600, 900],
    },
    Sunflower: {
      optimalTempRangeC: [20, 30],
      rainfallCorrelation: 0.6,
      snowCorrelation: -0.2,
      pestSensitivity: 0.5,
      optimalSoilMoisture: [15, 25],
      optimalPrecipitation: [400, 600],
    },
    Sugarcane: {
      optimalTempRangeC: [20, 32],
      rainfallCorrelation: 0.85,
      snowCorrelation: -0.6,
      pestSensitivity: 0.7,
      optimalSoilMoisture: [30, 50],
      optimalPrecipitation: [1200, 1800],
    },
  };
  