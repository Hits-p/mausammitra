
import { NextResponse } from 'next/server';

const sectorCoordinates: Record<string, { lat: number; lon: number }> = {
  'Sector 6': { lat: 28.59267, lon: 77.05444 },
  'Sector 7': { lat: 28.58741, lon: 77.06731 },
  'Sector 8': { lat: 28.56583, lon: 77.06706 },
  'Sector 10': { lat: 28.58068, lon: 77.05682 },
  'Sector 11': { lat: 28.58657, lon: 77.04929 },
  'Sector 12': { lat: 28.59232, lon: 77.04051 },
  'Sector 14': { lat: 28.60223, lon: 77.02588 },
  'Sector 21': { lat: 28.55226, lon: 77.05828 },
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const requestedSector = searchParams.get('sector') || 'Sector 10';

    const sectorCoordinatesEntry = sectorCoordinates[requestedSector]
      ? requestedSector
      : 'Sector 10';

    const coordinates = sectorCoordinates[sectorCoordinatesEntry];

    const url =
      'https://api.open-meteo.com/v1/forecast' +
      `?latitude=${coordinates.lat}` +
      `&longitude=${coordinates.lon}` +
      '&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m' +
      '&hourly=precipitation_probability,precipitation' +
      '&forecast_days=3' +
      '&timezone=Asia%2FKolkata';

    const response = await fetch(url, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Weather API failed: ${response.status}`);
    }

    const data = await response.json();

    const hourlyTimes: string[] = data.hourly?.time ?? [];
    const hourlyPrecipitation: number[] =
      data.hourly?.precipitation ?? [];
    const hourlyRainProbability: number[] =
      data.hourly?.precipitation_probability ?? [];

    // Find the first hourly forecast at or after the current time.
    const currentHourIndex = hourlyTimes.findIndex(
      (time) => time >= data.current.time
    );

    // Sum 24 hourly precipitation forecasts.
    const rainfallNext24HoursMm =
      currentHourIndex >= 0
        ? hourlyPrecipitation
            .slice(currentHourIndex, currentHourIndex + 24)
            .reduce((sum, value) => sum + (value ?? 0), 0)
        : null;

    const rainProbability =
      currentHourIndex >= 0
        ? hourlyRainProbability[currentHourIndex] ?? 0
        : 0;

    return NextResponse.json({
      sector: sectorCoordinatesEntry,
      temperature: data.current.temperature_2m,
      humidity: data.current.relative_humidity_2m,
      feelsLike: data.current.apparent_temperature,
      precipitation: data.current.precipitation,
      weatherCode: data.current.weather_code,
      windSpeed: data.current.wind_speed_10m,
      rainProbability,
      rainfallNext24HoursMm,
    });
  } catch (error) {
    console.error('Weather API error:', error);

    return NextResponse.json(
      { error: 'Unable to fetch weather data' },
      { status: 500 }
    );
  }
}
