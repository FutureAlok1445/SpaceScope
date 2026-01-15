const NASA_API_BASE = "https://api.nasa.gov";
const NASA_API_KEY = process.env.NEXT_PUBLIC_NASA_API_KEY || "DEMO_KEY";

interface NASAResponse<T> {
  data?: T;
  error?: string;
}

async function fetchWithRetry<T>(
  url: string,
  retries = 3,
  delay = 1000
): Promise<NASAResponse<T>> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, {
        next: { revalidate: 300 }, // 5 min cache
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      if (i === retries - 1) {
        return { error: error instanceof Error ? error.message : "Unknown error" };
      }
      await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)));
    }
  }
  return { error: "Max retries exceeded" };
}

export interface ISSPosition {
  latitude: number;
  longitude: number;
  altitude: number;
  velocity: number;
  timestamp: number;
}

export async function getISSPosition(): Promise<NASAResponse<ISSPosition>> {
  const url = `${NASA_API_BASE}/planetary/earth/iss?api_key=${NASA_API_KEY}`;
  return fetchWithRetry<ISSPosition>(url);
}

export interface SolarFlare {
  flrID: string;
  beginTime: string;
  peakTime: string;
  endTime: string;
  classType: string;
  sourceLocation: string;
}

export async function getSolarFlares(): Promise<NASAResponse<SolarFlare[]>> {
  const url = `${NASA_API_BASE}/DONKI/FLR?startDate=${new Date().toISOString().split("T")[0]}&api_key=${NASA_API_KEY}`;
  return fetchWithRetry<SolarFlare[]>(url);
}

export interface NearEarthObject {
  id: string;
  name: string;
  close_approach_data: Array<{
    close_approach_date: string;
    miss_distance: {
      kilometers: string;
    };
    relative_velocity: {
      kilometers_per_second: string;
    };
  }>;
}

export async function getNearEarthObjects(): Promise<NASAResponse<NearEarthObject[]>> {
  const today = new Date().toISOString().split("T")[0];
  const url = `${NASA_API_BASE}/neo/rest/v1/feed?start_date=${today}&api_key=${NASA_API_KEY}`;
  return fetchWithRetry<NearEarthObject[]>(url);
}

export interface APOD {
  url: string;
  title: string;
  explanation: string;
  date: string;
}

export async function getAPOD(): Promise<NASAResponse<APOD>> {
  const url = `${NASA_API_BASE}/planetary/apod?api_key=${NASA_API_KEY}`;
  return fetchWithRetry<APOD>(url);
}

