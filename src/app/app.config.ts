const weatherAPIKey = 'd3c1679d9f54430e984122852222007';
export const api = {
  baseUrl: 'http://localhost:3000',
  weatherUrl: `https://api.weatherapi.com/v1/forecast.json?key=${weatherAPIKey}&days=1&aqi=no&alerts=no&q=`
  // append city name in end of weatherUrl
};