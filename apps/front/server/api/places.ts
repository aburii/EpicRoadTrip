import { PlacesRes, placesUrl } from '@roadtrip/google-api';

type QueryType = {
  location: string;
  radius: number;
  type: string;
};

export default defineEventHandler(async (event): Promise<PlacesRes> => {
  const query: QueryType = getQuery(event);
  const data: PlacesRes = await $fetch(placesUrl, {
    method: 'GET',
    query: {
      location: query.location,
      type: query.type,
      radius: query.radius,
      key: process.env.GOOGLE_API_KEY,
    },
  });
  return data;
});
