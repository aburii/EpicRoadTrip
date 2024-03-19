import { DirectionsRes, directionsUrl } from '@roadtrip/google-api';

type QueryType = {
  origin: string;
  destination: string;
  waipoints?: string | null;
};

export default defineEventHandler(async (event): Promise<DirectionsRes> => {
  const query: QueryType = getQuery(event);
  const data: DirectionsRes = await $fetch(directionsUrl, {
    method: 'GET',
    query: {
      origin: query.origin,
      destination: query.destination,
      waypoints: query.waipoints,
      key: process.env.GOOGLE_API_KEY,
    },
  });
  return data;
});
